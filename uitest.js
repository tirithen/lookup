const blessed = require('blessed');
const lookupstuff = require('./lookupstuff');

// Create a screen object.
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true
});

screen.title = 'my window title';

const queryPanel = blessed.textbox({
  parent: screen,
  name: 'query',
  inputOnFocus: true,
  top: 0,
  width: '100%',
  height: 1,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

const contentPanel = blessed.box({
  tags: true,
  width: '100%',
  height: screen.height - 2,
  bottom: 1,
  mouse: true,
  keys: true,
  alwaysScroll: true,
  scrollable: true,
  scrollbar: true,
  style: {
    scrollbar: {
      bg: 'darkgray'
    }
  }
});

const statusPanel = blessed.box({
  width: '100%',
  height: 1,
  bottom: 0,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

function updateStatusPanel(status, url, error) {
  url = url ? '    URL: ' + url : '';
  error = error ? '    Error: ' + error : '';
  statusPanel.content = `Status: ${status}${url}${error}`;
  screen.render();
}

screen.key(['enter'], () => {
  updateStatusPanel('loading...');
  lookupstuff(queryPanel.value).then((result) => {
    contentPanel.content = result.content;
    updateStatusPanel('done', result.url);
    contentPanel.focus();
  }, (error) => {
    contentPanel.content = error.message;
    updateStatusPanel('error');
    queryPanel.focus();
  });

  queryPanel.focus();
});

screen.on('resize', () => {
  contentPanel.height = screen.height - 2;
  screen.render();
});

// Append our box to the screen.
screen.append(contentPanel);
screen.append(statusPanel);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

screen.key(['up', 'pageup', 'down', 'pagedown'], () => {
  contentPanel.focus();
});

// Focus our element.
queryPanel.focus();

// Render the screen.
screen.render();
