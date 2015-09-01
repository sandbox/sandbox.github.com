require 'webrick'

class JSONGzFileHandler < WEBrick::HTTPServlet::FileHandler
  def do_GET(req, res)
    super
    res['Content-Encoding'] = 'gzip' if req.path =~ /.json.gz$/
  end
end

WEBrick::HTTPServlet::FileHandler = JSONGzFileHandler
