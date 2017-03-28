
import { OfflineMessageHandler } from './lib/OfflineMessagesHandler';
import * as express from 'express';

import { OfflineMessages } from './lib/OfflineMessages';

let msg_dir: string = './msgs';
if (process.env.MSG_DIR)
  msg_dir = process.env.MSG_DIR;

let client_app = express();

let store = new OfflineMessages(msg_dir);

client_app.use('/', OfflineMessageHandler(store));

client_app.listen(3000, function () {
  console.log('Offline Messages Service listening on port 3000');
});
