
export default function save(data, filename = 'result.json') {
  const blob = new Blob([data], { type: 'text/json' });
  const e = document.createEvent('MouseEvents');

  const a = document.createElement('a');
  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  a.dispatchEvent(e);
}
