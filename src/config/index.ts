import 'dotenv/config';
import settings from './settings.json';

const config = { ...settings };
config.auth.domain = process.env.AUTH0_DOMAIN || '';
config.auth.clientId = process.env.AUTH0_CLIENT_ID || '';
config.auth.clientSecret = process.env.AUTH0_CLIENT_SECRET || '';
config.mailer.auth.user = process.env.SMTP_ACCOUNT || '';
config.mailer.auth.pass = process.env.SMTP_PWD || '';
config.postgres.host = process.env.DB_HOST || '';
config.postgres.db = process.env.DB_NAME || '';
config.postgres.user = process.env.DB_USER || '';
config.postgres.password = process.env.DB_PWD || '';

export default {
  ...config,
};
