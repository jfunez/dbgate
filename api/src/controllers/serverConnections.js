
const connections = require('./connections');
const socket = require('../utility/socket');
const { fork } = require('child_process');

module.exports = {
  opened: [],

  handle_databases(id, { databases }) {
    const existing = this.opened.find(x => x.id == id);
    if (!existing) return;
    existing.databases = databases;
    socket.emit(`database-list-changed-${id}`);
  },
  handle_error(id, { error }) {
    console.log(error);
  },

  async ensureOpened(id) {
    const existing = this.opened.find(x => x.id == id);
    if (existing) return existing;
    const connection = await connections.get({ id });
    const subprocess = fork(`${__dirname}/../proc/serverConnectionProcess.js`);
    const newOpened = {
      id,
      subprocess,
      databases: [],
      connection,
    };
    this.opened.push(newOpened);
    // @ts-ignore
    subprocess.on('message', ({ msgtype, ...message }) => {
      this[`handle_${msgtype}`](id, message);
    });
    subprocess.send({ msgtype: 'connect', ...connection });
    return newOpened;
  },

  listDatabases_meta: 'get',
  async listDatabases({ id }) {
    const opened = await this.ensureOpened(id);
    return opened.databases;
  },
};
