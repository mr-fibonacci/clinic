declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Session {
      currentUser: {
        email: string;
      };
    }
  }
}

export {};
