module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_TOKEN: process.env.API_TOKEN 
  DATATBASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin:onetwothreefour@localhost/noteful'
};