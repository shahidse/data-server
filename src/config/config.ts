export default () => ({
  emailConfig: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    redirectUrl: process.env.REDIRECT_URL,
    transporterName: process.env.TRANSPORTER_NAME,
    email: process.env.EMAIL,
    emailTransport: process.env.EMAIL_TRANSPORT,
  },
  db: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  root: { root: process.env.ROOT },
  userGroup: {
    org1: process.env.ORGANIZATION1,
  },
  role: {
    role1: process.env.ROLE1,
    role2: process.env.ROLE2,
  },
  admins: {
    admin1: {
      userName: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      fullName: process.env.ADMIN_FULLNAME,
      phoneNumber: process.env.ADMIN_PHONENUMBER,
    },
  },
  app: {
    port: process.env.APP_PORT,
  },
});
