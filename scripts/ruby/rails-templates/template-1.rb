#template-1.rb

# set correct ruby version
run "rbenv local 2.3.1"


puts "------------------------------------------------------------------------------------------"
##################################
#          INSTALL GEMS          #
##################################
puts "***************** INSTALL GEMS *****************"

gem 'oauth2'
gem 'rabl'
gem 'cancan'
gem 'devise'
gem 'delayed_job'
gem 'bootstrap-sass'
gem 'squeel'
gem 'skylight'
gem 'grape'
gem 'roo'
gem 'draper'
gem 'ice_cube'
gem 'bcrypt'
gem 'rails'
gem 'pg'
gem 'rails_12factor'
gem 'redis-session-store'

gem 'sprockets'

# for use with grape
gem 'hashie-forbidden_attributes'

gem_group :development do
  gem 'thin'
  gem 'pry'
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'pry-stack_explorer'
  gem 'pry-coolline'
  gem 'pry-em'
  gem 'pry-theme'
  gem 'pry-macro'
  gem 'pry-inline'
  gem 'pry-git'
  gem 'pry-rails'
  gem 'pry-awesome_print'
  gem 'pry-pretty-numeric'
  gem 'hirb'
  gem 'meta_request'
  gem 'better_errors'
  gem 'rubocop'
  gem 'capistrano-rails'
end

gem_group :assets do
	gem 'sprockets-es6'
end

gem_group :test, :development do
	# gem 'minitest'
	# gem 'mini_backtrace'
	gem 'factory_girl'
	# gem 'minitest-reporters'
  gem 'factory_girl_rails'
  gem 'rspec'
  gem 'rspec-rails'
end

run "bundle install"


puts "------------------------------------------------------------------------------------------"
##################################
#          INITIALIZERS          #
##################################
puts "***************** INITIALIZERS *****************"

puts " ----- DECIDE WHETHER TO USE REDIS AS A SESSION STORE (use cookies if not) -----"
def select_redis_port
  counter = 1
  get_port = ->{
  	puts "What port would you like to assign to redis?"
    port = $stdin.gets.to_i
    if port < 1
      return 6379 if counter >= 3
      puts "invalid port - please input an integer above 0"
      counter = counter + 1
      return get_port.call
    end
    port
  }
  get_port.call
end

if yes?("Do you want to use redis?")
	session_store = :redis_session_store
	redis_port = yes?("Would you like to use a custom redis port, or the default 6379?") ? select_redis_port : 6379
	initializer 'redis.rb', <<-CODE
		My::Application.config.session_store :redis_session_store, {
		  key: 'your_session_key',
		  redis: {
		    db: 2,
		    expire_after: 120.minutes,
		    key_prefix: 'myapp:session:',
		    host: 'host', # Redis host name, default is localhost
		    port: 12345   # Redis port, default is 6379
		    serializer: :hybrid
		  }
		}
	CODE
# else
	# session_store = :cookie_store
end
puts " -------------------------------------------------------------------------------"


puts "------------------------------------------------------------------------------------------"
#######################################
#          ENVIRONMENT SETUP          #
#######################################
puts "***************** ENVIRONMENT SETUP *****************"
environment <<-ENV
	config.time_zone = 'Eastern Time (US & Canada)'
	config.session_store = #{session_store}
	javascript_engine = :js
	config.generators do |g|
	  g.orm :active_record
	  g.test_framework :rspec
	  g.javascript_engine :js
	  g.stylesheet_engine :scss
	end
  console do
    # this block is called only when running console, so we can safely require pry here
    gem 'pry'
    gem 'pry-byebug'
    gem 'pry-rails'
    gem 'pry-stack_explorer'
    gem 'pry-coolline'
    gem 'pry-em'
    gem 'pry-theme'
    gem 'pry-macro'
    gem 'pry-inline'
    gem 'pry-git'
    gem 'pry-rails'
    gem 'pry-awesome_print'
    gem 'pry-pretty-numeric'
    gem 'hirb'
    config.console = Pry
  end
ENV

puts "------------------------------------------------------------------------------------------"
################################
#          RAKE TASKS          #
################################
puts "***************** RAKE TASKS *****************"
rakefile("shell.rake") do
	<<-TASK
		namespace :process do
			desc "Kill all ruby processes"
			task :killall do
				puts "killing all ruby processes"
				run("ps aux | ")
			end
		end
	TASK
end

puts "------------------------------------------------------------------------------------------"
###########################################
#          BUILD SUBLIME PROJECT          #
###########################################
puts "***************** BUILD SUBLIME PROJECT *****************"
run <<-SUBLIMEPROJECT
echo '{
  "folders":
  [
    {
      "path": "/home/andrew/.config/sublime-text-3/Packages/User/snippets"
    },
    {
      "path": "."
    }
  ]
}' >> #{@app_name}.sublime-project
SUBLIMEPROJECT


puts "------------------------------------------------------------------------------------------"
########################################
#          GENERATORS - SETUP          #
########################################
puts "***************** GENERATORS - SETUP *****************"

# generate(:scaffold, "person name:string")
# route "root to: 'people#index'"
rake("db:migrate")
 
after_bundle do
  git :init
  git add: "."
  git commit: %Q{ -m 'Initial commit' }
  #nodeJS modules ignore
  `echo 'node_modules' >> .gitignore`
  #install lodash
  `mkdir app/assets/javascripts`
  `touch 'app/assets/javascripts/application.js'`
	`echo "//= require lodash" >> app/assets/javascripts/application.js`

  puts "------------------------------------------------------------------------------------------"
  ###################################
  #          INSTALLATIONS          #
  ###################################
  puts "***************** INSTALLATIONS *****************"

  # insert default urls for mailer
  `sed -i "3 i\\\n  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }" config/environments/test.rb`
  `sed -i "3 i\\\n  config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }" config/environments/development.rb`

  # RUN THESE AFTERWARDS:
  # cd ${@app_name}
  # bin/rails generate rspec:install
  # add squeel
  # bin/rails generate squeel:initializer
  # install devise
  # bin/rails generate devise:install

  # ADD THESE TO application.rb if using grape:
  # config.paths.add File.join('app', 'api'), glob: File.join('**', '*.rb')
  # config.autoload_paths += Dir[Rails.root.join('app', 'api', '*')]
end