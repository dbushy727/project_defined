ProjectDefined::Application.routes.draw do
  devise_for :users
  root to: 'home#index'
  
  get '/history' => 'home#history'
  get '/workouts/history' => 'workout_sessions#index'
  get '/exercise/:id/history' => 'exercises#history'

  post 'workouts/new/exercise' => 'workouts#add_exercise_to_workout', as: :add_exercise_to_workout
  post 'workouts/unlink/exercise' => 'workouts#unlink_exercise_from_workout', as: :unlink_exercise_from_workout
  post 'workouts/session' => 'workout_sessions#workout_session_data'
  post 'workouts/new_session' => 'workout_sessions#create', as: :new_workout_session
  resources :workouts
  resources :exercises

end

#                       Prefix Verb   URI Pattern                         Controller#Action
#             new_user_session GET    /users/sign_in(.:format)            devise/sessions#new
#                 user_session POST   /users/sign_in(.:format)            devise/sessions#create
#         destroy_user_session DELETE /users/sign_out(.:format)           devise/sessions#destroy
#                user_password POST   /users/password(.:format)           devise/passwords#create
#            new_user_password GET    /users/password/new(.:format)       devise/passwords#new
#           edit_user_password GET    /users/password/edit(.:format)      devise/passwords#edit
#                              PATCH  /users/password(.:format)           devise/passwords#update
#                              PUT    /users/password(.:format)           devise/passwords#update
#     cancel_user_registration GET    /users/cancel(.:format)             devise/registrations#cancel
#            user_registration POST   /users(.:format)                    devise/registrations#create
#        new_user_registration GET    /users/sign_up(.:format)            devise/registrations#new
#       edit_user_registration GET    /users/edit(.:format)               devise/registrations#edit
#                              PATCH  /users(.:format)                    devise/registrations#update
#                              PUT    /users(.:format)                    devise/registrations#update
#                              DELETE /users(.:format)                    devise/registrations#destroy
#                         root GET    /                                   home#index
#                      history GET    /history(.:format)                  home#history
#             workouts_history GET    /workouts/history(.:format)         workout_sessions#index
#                              GET    /exercise/:id/history(.:format)     exercises#history
#      add_exercise_to_workout POST   /workouts/new/exercise(.:format)    workouts#add_exercise_to_workout
# unlink_exercise_from_workout POST   /workouts/unlink/exercise(.:format) workouts#unlink_exercise_from_workout
#             workouts_session POST   /workouts/session(.:format)         workout_sessions#workout_session_data
#                     workouts GET    /workouts(.:format)                 workouts#index
#                              POST   /workouts(.:format)                 workouts#create
#                  new_workout GET    /workouts/new(.:format)             workouts#new
#                 edit_workout GET    /workouts/:id/edit(.:format)        workouts#edit
#                      workout GET    /workouts/:id(.:format)             workouts#show
#                              PATCH  /workouts/:id(.:format)             workouts#update
#                              PUT    /workouts/:id(.:format)             workouts#update
#                              DELETE /workouts/:id(.:format)             workouts#destroy
#                    exercises GET    /exercises(.:format)                exercises#index
#                              POST   /exercises(.:format)                exercises#create
#                 new_exercise GET    /exercises/new(.:format)            exercises#new
#                edit_exercise GET    /exercises/:id/edit(.:format)       exercises#edit
#                     exercise GET    /exercises/:id(.:format)            exercises#show
#                              PATCH  /exercises/:id(.:format)            exercises#update
#                              PUT    /exercises/:id(.:format)            exercises#update
#                              DELETE /exercises/:id(.:format)            exercises#destroy
