# Restaurant Management API

Production-ready scaffold for a Restaurant Management API built with NestJS, TypeScript, Mongoose and MongoDB.

Key features implemented:
- Create / List / Get Restaurant (by id or slug) endpoints
- GeoSpatial query to find nearby restaurants within 1KM
- User schema with favorite cuisines
- User <-> Restaurant follow relationship schema (many-to-many)
- Recommendation API: given user id, finds users sharing favorite cuisines, aggregates restaurants they follow using MongoDB Aggregation Pipeline
- Swagger documentation available via Swagger decorators

## Tech stack
- NestJS + TypeScript
- Express (via Nest)
- MongoDB + Mongoose
- Class-validator / DTOs
- Swagger (OpenAPI) generated with Nest's decorators

## Quickstart (development)
1. Copy `.env.example` to `.env` and set `MONGODB_URI`.
2. Install dependencies
```bash
npm install
```
3. Run in development
```bash
npm run start:dev
```
4. Open Swagger UI at: `http://localhost:3000/api/docs`

## Project layout
- `src/` main app
  - `restaurants/` module, controller, service, schema, DTOs
  - `users/` module, controller, service, schema, DTOs
  - `recommendations/` module (aggregation)
- `README.md`, `.env.example`, `package.json`, `tsconfig.json`

## Notes on implementation
- Restaurants store `location` as GeoJSON Point and include `cuisines` array (1..3).
- Geospatial index on `location` for proximity queries.
- Recommendations API uses a single aggregation pipeline:
  1. Find user and their favorite cuisines.
  2. Find other users sharing at least one favorite cuisine.
  3. Lookup restaurants followed by those users; group and return unique restaurants.
- Input validation via DTOs + class-validator.

## Deliverables
This archive contains the full project scaffold ready for `npm install`.

