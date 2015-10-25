# Description:
#     Jarvis 
#
# Dependencies:
#     None
#
# Configurations:
#     None
#
# Commands:
#     jarvis create poll
#     jarvis stop poll
#     jarvis add poll option
#     jarvis remove poll option
#     jarvis current poll - displays the currently ongoing poll
#     jarvis help - displays the help command
# 
# Author:
#     addykim
#

class pollManager
    constructor: (@robot) ->
        storageLoaded = =>
            @storage = @robot.brain.data.ama ||= {
           

poll = 
    question: 
    

module.exports = (robot) ->

    robot.respond /create poll/i, (msg) ->
      msg.send "Poll created"
    robot.respond /add poll option/i, (msg) ->
      msg.send "Add poll option"
    robot.hear /help/i, (msg) ->
      msg.send "Help"
    robot.hear /test/i, (msg) ->
      msg.send "Testing testing 123"
