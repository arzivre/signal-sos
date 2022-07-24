declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      EMAIL_SERVER: string;
      EMAIL_FROM: string;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: number;
      EMAIL_FROM: string;
    }
  }
}

export {}
