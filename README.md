# Inhouse Chess

Host your own chess league at work to connect your coworkers

## Development

```sh
cp .env.example .env  # Contains requires environment variables
vi .env               # Set environment variables
pnpm install          # Install dependencies
pnpm dev              # Run application
```

## Running the application

Via Docker Compose:

```sh
docker compose up
```

Via Docker:

```sh
docker build -t chess --build-arg NEXT_PUBLIC_CLIENTVAR=clientvar .
docker run -p 3000:3000 -e DATABASE_URL="..." -e NEXTAUTH_SECRET="..." -e NEXTAUTH_URL="..." -e DISCORD_CLIENT_ID="..." -e DISCORD_CLIENT_SECRET="..." chess
```

## Screenshots

![Homepage](/docs/1_home.png?raw=true "Homepage")

![Profile](/docs/2_profile.png?raw=true "Profile")

![Find players](/docs/3_find_players.png?raw=true "Find players")

![Leaderboard](/docs/4_leaderboard.png?raw=true "Leaderboard")

## License

Source code is distributed under the MIT License. See LICENSE.txt for more information.
