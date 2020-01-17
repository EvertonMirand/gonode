"use strict";

const Mail = use("Mail");
const Helpers = use("Helpers");
const TaskHook = (exports = module.exports = {});

TaskHook.sendNewTaskMail = async taskInstance => {
  console.log(taskInstance.dirty);

  if (!taskInstance.user_id && !taskInstance.dirty.user_id) {
    return;
  }

  const { email, username } = await taskInstance.user().fetch();

  const file = await taskInstance.file().fetch();

  const { title } = taskInstance;

  await Mail.send(
    ["emails.new_task"],
    {
      username,
      title,
      hasAttachment: !!file
    },
    message => {
      message
        .to(email)
        .from("everton@miranda.com", "Everton | Miranda")
        .subject("Nova tarefa para você");

      if (file) {
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name
        });
      }
    }
  );
};
