const { test, before, afterEach, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

let window, React, createRoot, act, Board, root, host;

before(async () => {
  const { Window } = await import('happy-dom');
  window = new Window({ url: 'http://localhost' });
  for (const key of [
    'window',
    'document',
    'HTMLElement',
    'Element',
    'Node',
    'Document',
    'SVGElement',
    'MutationObserver',
    'ResizeObserver',
  ]) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: key === 'window' ? window : window[key],
    });
  }
  globalThis.getComputedStyle = window.getComputedStyle.bind(window);
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    const column = this.closest('[data-column]');
    const x = column?.dataset.column === 'done' ? 320 : 0;
    const card = this.dataset.testid === 'card';
    return {
      x: x + (card ? 10 : 0),
      y: card ? 30 : 0,
      left: x + (card ? 10 : 0),
      top: card ? 30 : 0,
      width: card ? 280 : 300,
      height: card ? 80 : 400,
      right: x + (card ? 290 : 300),
      bottom: card ? 110 : 400,
      toJSON() {},
    };
  };
  React = require('react');
  act = React.act;
  createRoot = require('react-dom/client').createRoot;
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(`${__dirname}/Board.tsx`, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  new Function('require', 'module', 'exports', code)(require, module, module.exports);
  Board = module.exports;
});

afterEach(async () => {
  if (root) await act(() => root.unmount());
  host?.remove();
});
after(() => window.happyDOM.abort());

async function renderBoard() {
  const moves = [],
    edits = [];
  const h = React.createElement;
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
  await act(() =>
    root.render(
      h(
        Board.KanbanBoard,
        { onDragEnd: (move) => moves.push(move) },
        h(
          Board.KanbanColumn,
          { id: 'pending' },
          h(
            'div',
            { 'data-column': 'pending' },
            h(
              Board.KanbanCard,
              { id: 'item-1' },
              h(
                'div',
                { 'data-testid': 'card' },
                h('span', { 'data-testid': 'label' }, 'Card'),
                h('button', { onClick: () => edits.push(true) }, 'Edit'),
              ),
            ),
          ),
        ),
        h(Board.KanbanColumn, { id: 'done' }, h('div', { 'data-column': 'done' }, 'Empty column')),
      ),
    ),
  );
  return { moves, edits, card: host.querySelector('[data-testid="card"]') };
}

async function key(target, code) {
  await act(async () => {
    target.dispatchEvent(
      new window.KeyboardEvent('keydown', { code, key: code, bubbles: true, cancelable: true }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
}

async function mouse(target, type, x, y) {
  await act(async () => {
    target.dispatchEvent(
      new window.MouseEvent(type, {
        clientX: x,
        clientY: y,
        button: 0,
        buttons: type === 'mouseup' ? 0 : 1,
        bubbles: true,
        cancelable: true,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
}

async function touch(target, type, x, y, delay = 10) {
  await act(async () => {
    const point = { identifier: 1, target, clientX: x, clientY: y };
    target.dispatchEvent(
      new window.TouchEvent(type, {
        touches: type === 'touchend' ? [] : [point],
        changedTouches: [point],
        bubbles: true,
        cancelable: true,
      }),
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  });
}

test('keyboard moves a card to an empty column with its original status and id', async () => {
  const { moves, card } = await renderBoard();
  card.focus();
  await key(card, 'Space');
  await key(document, 'ArrowRight');
  await key(document, 'Space');
  assert.deepEqual(moves, [
    { draggableId: 'item-1', source: { droppableId: 'pending' }, destination: { droppableId: 'done' } },
  ]);
});

test('Escape and dropping in the original column do not persist a change', async () => {
  const { moves, card } = await renderBoard();
  card.focus();
  await key(card, 'Enter');
  await key(document, 'ArrowRight');
  await key(document, 'Escape');
  await key(card, 'Space');
  await key(document, 'Space');
  assert.deepEqual(moves, []);
});

test('mouse dragging starts from card content and moves into an empty column', async () => {
  const { moves, card } = await renderBoard();
  await mouse(card.querySelector('span'), 'mousedown', 30, 50);
  await mouse(document, 'mousemove', 40, 50);
  const overlay = document.querySelector('[inert]');
  assert.ok(overlay, 'dragging renders an overlay');
  assert.equal(host.contains(overlay), false, 'the overlay escapes the board scroll container');
  await mouse(document, 'mousemove', 450, 100);
  await mouse(document, 'mouseup', 450, 100);
  assert.equal(moves.length, 1);
  assert.equal(moves[0].destination.droppableId, 'done');
});

test('releasing outside the board does not change the card status', async () => {
  const { moves, card } = await renderBoard();
  await mouse(card, 'mousedown', 30, 50);
  await mouse(document, 'mousemove', 40, 50);
  await mouse(document, 'mousemove', 900, 600);
  await mouse(document, 'mouseup', 900, 600);
  assert.deepEqual(moves, []);
});

test('embedded edit controls remain clickable and do not initiate a drag', async () => {
  const { moves, edits, card } = await renderBoard();
  const button = card.querySelector('button');
  await mouse(button, 'mousedown', 30, 50);
  await mouse(document, 'mousemove', 450, 100);
  await mouse(document, 'mouseup', 450, 100);
  await act(() => button.click());
  assert.deepEqual(moves, []);
  assert.deepEqual(edits, [true]);
});

test('a touch long press moves a card into an empty column', async () => {
  const { moves, card } = await renderBoard();
  await touch(card, 'touchstart', 30, 50, 300);
  await touch(document, 'touchmove', 450, 100);
  await touch(document, 'touchend', 450, 100);
  assert.equal(moves.length, 1);
  assert.equal(moves[0].destination.droppableId, 'done');
});

test('touch scrolling before the long press does not move a card', async () => {
  const { moves, card } = await renderBoard();
  await touch(card, 'touchstart', 30, 50);
  await touch(document, 'touchmove', 30, 100, 300);
  await touch(document, 'touchend', 30, 100);
  assert.deepEqual(moves, []);
});
