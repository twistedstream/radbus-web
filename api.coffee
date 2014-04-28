exports.register = (server) ->
  # serve up client-side config file that contains all the Google OAuth2 config values
  server.get '/js/api-config.js', (req, res) ->
    res.set 'Content-Type', 'application/javascript'
    res.send "var apiBaseUrl = '#{process.env.BUS_API_BASE_URL}';\n";