import { RequestHandler } from 'express';
import { Parser } from 'xml2js';
import * as express from 'express';
import * as Promise from 'bluebird';

import { OfflineMessages } from './OfflineMessages';

export function OfflineMessageHandler(store: OfflineMessages): express.Router {
  let router = express.Router();
  // insert middleware to put the body back
  router.use(function(req, res, next) {
    var data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      data += chunk;
    });
    req.on('end', function() {
      req.body = data;
      next()
    });
  });

  router.post('/SaveMessage', (req, res) => {
    let xmlMessage: string = req.body;
    //xmlMessage = xmlMessage.slice(xmlMessage.lastIndexOf('?>') + 2);

    let p = new Parser();

    new Promise<string>((resolve, reject) => {
      p.parseString(xmlMessage, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }).then((xml: any) => {
      let toAgent = xml.GridInstantMessage.toAgentID[0];
      return store.save(toAgent.toString(), xmlMessage);
    }).then(() => {
      res.send('<?xml version="1.0" encoding="utf-8"?><boolean>true</boolean>');
    }).catch((err) => {
      console.log('Error saving offline message: ' + err.Message);
      res.send('');
    });
  });


  router.post('/RetrieveMessages', (req, res) => {
    let xmlMessage: string = req.body;
    let p = new Parser();
    let userID: string;
    new Promise<string>((resolve, reject) => {
      p.parseString(xmlMessage, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    }).then((xml: any) => {
      userID = xml.UUID.Guid[0];
      return store.getFor(userID.toString());
    }).then((messages: string) => {
      res.send('<?xml version="1.0" encoding="utf-8"?>' + 
      '<ArrayOfGridInstantMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
        messages + '</ArrayOfGridInstantMessage>'
      );
    }).then(() => {
      return store.destroyFor(userID.toString());
    }).catch((err) => {
      console.log('Error saving offline message: ' + err.Message);
      res.send('');
    });
  });

  return router;
}
