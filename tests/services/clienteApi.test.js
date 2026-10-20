import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { crearClienteApi, ErrorApi } from '../../src/services/clienteApi.js';

const respuesta = (estado, cuerpo) => ({
  ok: estado >= 200 && estado < 300,
  status: estado,
  text: async () => (cuerpo === undefined ? '' : JSON.stringify(cuerpo)),
});

const crear = (fetchFn) => crearClienteApi({ baseUrl: 'http://api.test', fetchFn });

describe('clienteApi', () => {
  it('arma la URL con parámetros y omite los vacíos', async () => {
    let pedida;
    const cliente = crear(async (url, opciones) => {
      pedida = { url, opciones };
      return respuesta(200, { ok: true });
    });
    await cliente.get('/games', { mode: 'LOCAL', alias: '', status: undefined });
    assert.equal(pedida.url, 'http://api.test/games?mode=LOCAL');
    assert.equal(pedida.opciones.method, 'GET');
  });

  it('envía el cuerpo JSON en los POST', async () => {
    let pedida;
    const cliente = crear(async (url, opciones) => {
      pedida = opciones;
      return respuesta(201, { id: '1' });
    });
    const datos = await cliente.post('/games', { mode: 'LOCAL' });
    assert.deepEqual(datos, { id: '1' });
    assert.equal(pedida.method, 'POST');
    assert.equal(pedida.headers['Content-Type'], 'application/json');
    assert.equal(pedida.body, '{"mode":"LOCAL"}');
  });

  it('convierte el error del backend en ErrorApi', async () => {
    const cliente = crear(async () => respuesta(400, {
      error: { code: 'INVALID_MOVE', message: 'Jugada inválida', details: { from: 'e2' } },
    }));
    await assert.rejects(cliente.post('/games/1/moves', {}), (error) => {
      assert.ok(error instanceof ErrorApi);
      assert.equal(error.codigo, 'INVALID_MOVE');
      assert.equal(error.message, 'Jugada inválida');
      assert.deepEqual(error.detalles, { from: 'e2' });
      assert.equal(error.estado, 400);
      return true;
    });
  });

  it('informa cuando el servidor no responde', async () => {
    const cliente = crear(async () => { throw new TypeError('fetch failed'); });
    await assert.rejects(cliente.get('/health'), (error) => {
      assert.equal(error.codigo, 'SIN_CONEXION');
      return true;
    });
  });

  it('tolera respuestas de error que no son JSON', async () => {
    const cliente = crear(async () => ({ ok: false, status: 502, text: async () => 'Bad Gateway' }));
    await assert.rejects(cliente.get('/health'), (error) => {
      assert.equal(error.estado, 502);
      assert.match(error.message, /502/);
      return true;
    });
  });
});
