# RCSForum

[English](README.md) | [简体中文](README.zh-CN.md)

A forum client for the Feishu/Douyin Open Platform mini-app runtime, used with the `RCSForum_Server` backend. The client uses `tt.*` APIs for login, network requests, image uploads, and local storage.

## Features

- Platform account login
- Browse and publish topics
- Comments, likes, and removing likes
- Anonymous posts
- Image uploads and display
- Emoji stickers
- User profiles
- Check-in online time tracking and leaderboards
- Content deletion by administrators

## Pages

```text
pages/
├── index/       # Topic list
├── space/       # User space
├── checkin/     # Check-in and leaderboard
├── newtopic/    # Publish a topic
├── topic/       # Topic and comment details
└── user/        # User information
```

## Requirements

- Feishu or Douyin mini-app developer tools
- A deployed `RCSForum_Server`
- Login permissions for the corresponding Open Platform application

## Configure the backend URL

The client's backend URL is currently configured directly in `app.js`:

```js
url: "http://192.168.3.2"
```

After importing the project, replace it with your actual API URL. Running on a physical device or in production generally requires:

- A domain name or IP address accessible from the device
- HTTPS
- Adding the domain to the allowed request domains in the Open Platform console
- Consistency with the backend's upload size and timeout settings

## Getting started

1. Clone the repository.
2. Import the repository root into the mini-app developer tools.
3. Configure the application identifier and permissions.
4. Update the backend URL in `app.js`.
5. Start `RCSForum_Server`.
6. Build and run in the simulator or on a physical device.

The project does not depend on the regular browser DOM and is not a conventional web application. It must run in a mini-app environment that supports the `tt` API.

## Backend integration

The client calls the backend for:

- Platform identity exchange through `/login`
- Creating, reading, liking, and deleting topics and comments
- Image uploads and static image retrieval
- User profile and administrator status queries
- Check-in keepalive and leaderboard queries

Changes to API or authentication fields require corresponding updates to both the frontend and backend.

## Current notes

- The backend URL is hard-coded in the source. Moving it to environment or build configuration is recommended.
- The current development URL uses plain HTTP and is only suitable for debugging on a trusted local network.
- The client stores authentication information; avoid logging tokens.
- Uploaded files, anonymous content, and administrator actions must still be subject to backend permission checks. Client-side interface controls alone are insufficient.

## License

See `LICENSE` in the repository.
