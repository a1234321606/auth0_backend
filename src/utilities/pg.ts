import { Pool } from 'pg';
import config from '../config';

let pgPool: Pool;

const getConnection = () => {
  if (!pgPool) {
    pgPool = new Pool(config.postgres);
    pgPool.connect((err, client, release) => {
      if (err) console.error('Connect to postgres error: ', err.stack);
      else {
        client.query('SELECT NOW()', (e2) => {
          release();
          if (e2) {
            console.error('Error executing query', e2.stack);
          } else console.log('Connect to postgres successfully!');
        });
      }
    });
    pgPool.on('error', (err) => {
      console.error('Connect to postgres fail: ', err.stack);
    });
  }
  return pgPool;
};

const query = async (sql: string, values: any[]) => pgPool.query(sql, values);

getConnection();

export default {
  query,
};
