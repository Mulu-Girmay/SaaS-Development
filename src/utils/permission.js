exports.canReadNote = (note, userId) => {
  if (note.user.toString() === userId.toString()) return true;

  return note.collaborators.some(
    (c) => c.user.toString() === userId.toString()
  );
};

exports.canWriteNote = (note, userId) => {
  if (note.user.toString() === userId.toString()) return true;

  return note.collaborators.some(
    (c) =>
      c.user.toString() === userId.toString() &&
      c.permission === "write"
  );
};
