Rake::Task['assets:precompile'].clear
namespace :assets do
  task 'precompile' do
    puts '#---------- Skipping asset precompilation in favor or webpack ----------#'
  end
end