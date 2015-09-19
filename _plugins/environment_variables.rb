module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      site.config['serving'] = ENV['JEKYLL_SERVING']
      # Add other environment variables to `site.config` here...
    end

  end

end
