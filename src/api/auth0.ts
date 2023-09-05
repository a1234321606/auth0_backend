import axios from 'axios';
import https from 'https';
import config from '../config';

let token: string;
let expiredAt: number;

const getToken = async () => {
  const data = {
    client_id: config.auth.clientId,
    client_secret: config.auth.clientSecret,
    grant_type: 'client_credentials',
    audience: `https://${config.auth.domain}/api/v2/`,
  };
  const axiosOptions = {
    method: 'post',
    url: `https://${config.auth.domain}/oauth/token`,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data,
  };
  const res: any = await axios(axiosOptions);
  token = res.data.access_token;
  expiredAt = Date.now() + res.data.expires_in * 1000;
};

const getUsers = async () => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'get',
    url: `https://${config.auth.domain}/api/v2/users`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const getUserById = async (id: string, params?: any) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'get',
    url: `https://${config.auth.domain}/api/v2/users/${id}`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    params,
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const getUserToken = async (username: string, password: string) => {
  const axiosOptions = {
    method: 'post',
    url: `https://${config.auth.domain}/oauth/token`,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      client_id: config.auth.clientId,
      client_secret: config.auth.clientSecret,
      grant_type: 'password',
      audience: `https://${config.auth.domain}/api/v2/`,
      username,
      password,
    },
  };
  const res: any = await axios(axiosOptions);
  return res.data;
};

const getEmailVerifyTicket = async (userId: string) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'post',
    url: `https://${config.auth.domain}/api/v2/tickets/email-verification`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: { user_id: userId },
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const updateUserById = async (data: any, id: string) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'patch',
    url: `https://${config.auth.domain}/api/v2/users/${id}`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data,
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const deleteUserById = async (id: string) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'delete',
    url: `https://${config.auth.domain}/api/v2/users/${id}`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const sendEmailVerifyRequest = async (userId: string) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'post',
    url: `https://${config.auth.domain}/api/v2/jobs/verification-email`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: { user_id: userId },
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const sendPasswordResetRequest = async (email: string) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'post',
    url: `https://${config.auth.domain}/dbconnections/change_password`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: { email, connection: 'Username-Password-Authentication' },
  };
  const res = await axios(axiosOptions);
  return res.data;
};

const getLogs = async (params: any) => {
  if (!token || Date.now() > expiredAt) await getToken();

  const axiosOptions = {
    method: 'get',
    url: `https://${config.auth.domain}/api/v2/logs`,
    headers: { authorization: `Bearer ${token}` },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    params,
  };
  const res = await axios(axiosOptions);
  return res.data;
};

export default {
  getUsers,
  getUserById,
  getUserToken,
  getEmailVerifyTicket,
  updateUserById,
  deleteUserById,
  sendEmailVerifyRequest,
  sendPasswordResetRequest,
  getLogs,
};
