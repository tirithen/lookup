const blessed = require('blessed');
const lookupstuff = require('./lookupstuff');

// Create a screen object.
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true
});

screen.title = 'my window title';

const query = blessed.textbox({
  parent: screen,
  mouse: true,
  keys: true,
  name: 'query',
  inputOnFocus: true,
  top: 0,
  width: '100%',
  height: 1,
  style: {
    fg: 'yellow',
    bg: 'blue'
  }
});

// Create a box perfectly centered horizontally and vertically.
const box = blessed.box({
  tags: true,
  width: '100%',
  height: screen.height - 1,
  bottom: 0,
  mouse: true,
  keys: true,
  alwaysScroll: true,
  scrollable: true,
  scrollbar: true,
  style: {
    scrollbar: {
      bg: 'red',
      fg: 'blue'
    }
  }
});

screen.key(['enter'], () => {
  query.focus();
  lookupstuff(query.value).then((result) => {
    box.content = result.url + '\n' + result.content;
    query.focus();
  }, (error) => {
    box.content = error.message;
    query.focus();
  });
});

screen.on('resize', () => {
  box.height = screen.height - 1;
  screen.render();
});

// Append our box to the screen.
screen.append(box);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// Focus our element.
query.focus();

// Render the screen.
screen.render();
