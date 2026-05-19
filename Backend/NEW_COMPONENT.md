# New Component: Express Rate Limiting

## Overview
Rate limiting was implemented using the express-rate-limit middleware. This component restricts the number of requests a client can make within a defined time window, helping protect the API from misuse and overload.

---

## How it Enhances the Application

- Prevents repeated or automated requests such as brute-force login attempts  
- Protects server performance by limiting excessive traffic  
- Improves overall reliability and stability of the API  

---

## Implementation Details

- Applied globally to all `/api/v1` routes  
- Limit: 100 requests per 15 minutes per IP  
- Stricter limit applied to authentication routes (5 requests per 15 minutes)  

### Example Configuration

```ts
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});