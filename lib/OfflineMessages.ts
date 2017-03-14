
import * as path from 'path';
import * as fs from 'fs';
import * as Promise from 'bluebird';

export class OfflineMessages {
  private dir: string

  constructor(dir: string) {
    this.dir = dir;
  }

  private sectionUUID(uuid: string): string[] {
    return [
      uuid.substr(0, 3),
      uuid.substr(3, 3)
    ]
  }

  private getPath(uuid: string): string {
    let s = this.sectionUUID(uuid);
    return path.join(this.dir, s[0], s[1], uuid);
  }

  getFor(uuid: string): Promise<string> {
    return Promise.resolve().then(() => {
      return this.getPath(uuid);
    }).then((path: string) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
          if (err) return reject(err);
          resolve(data)
        })
      }).then((rawFile: Buffer) => {
        return rawFile.toString();
      })
    });
  }

  destroyFor(uuid: string): Promise<void> {
    return Promise.resolve().then(() => {
      return this.getPath(uuid);
    }).then((path: string) => {
      return new Promise<void>((resolve, reject) => {
        fs.unlink(path, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  }

  save(uuid: string, message: string): Promise<void> {
    return Promise.resolve().then(() => {
      return this.sectionUUID(uuid);
    }).then((dirs: string[]) => {
      return new Promise((resolve, reject) => {
        fs.mkdir(path.join(this.dir, dirs[0]), (err) => {
          if (err && err.code != 'EEXIST') return reject(err);
          resolve();
        });
      }).then(() => {
        return new Promise((resolve, reject) => {
          fs.mkdir(path.join(this.dir, dirs[0], dirs[1]), (err) => {
            if (err && err.code != 'EEXIST') return reject(err);
            resolve();
          });
        });
      });
    }).then(() => {
      return this.getPath(uuid);
    }).then((path: string) => {
      return new Promise<void>((resolve, reject) => {
        fs.appendFile(path, message, (err) => {
          if (err) return reject(err);
          resolve();
        })
      })
    });
  }
}