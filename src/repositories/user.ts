import pg from '../utilities/pg';

const getSessionLogs = async (conditions: string[] = [], conditionData: any[] = []) => {
  const sql = `
    SELECT id, user_id, timestamp FROM auth0_session_logs
    ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
  `;
  const res = await pg.query(sql, conditionData);
  return res.rows;
};

export default {
  getSessionLogs,
};
