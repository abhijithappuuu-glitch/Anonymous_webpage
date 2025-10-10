# MongoDB Atlas Connection String

Your MongoDB Atlas database is ready! Here's your connection information:

## Database Credentials:
- **Username**: anonymoussdmcet_db_user
- **Password**: 0Bpf2PiwefdgHyV2

## Connection String Format:
Your connection string should look like this:
```
mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@cluster0.xxxxx.mongodb.net/anonymous-club?retryWrites=true&w=majority
```

## To Get Your Exact Connection String:

1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com
2. Click on your cluster name
3. Click "Connect" button
4. Choose "Connect your application"
5. Select "Node.js" as driver
6. Copy the connection string
7. Replace `<password>` with: `0Bpf2PiwefdgHyV2`
8. Replace `<database>` with: `anonymous-club`

## Next Steps:
1. Copy your exact connection string from Atlas
2. Use it in Render deployment (next step)

The connection string will replace this environment variable:
```
MONGODB_URI=mongodb+srv://anonymoussdmcet_db_user:0Bpf2PiwefdgHyV2@cluster0.xxxxx.mongodb.net/anonymous-club?retryWrites=true&w=majority
```

Note: Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL from Atlas.