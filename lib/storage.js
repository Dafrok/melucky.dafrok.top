function getObjectStorage(key) {
  const data = localStorage.getItem(key) || "{}";
  return JSON.parse(data);
}

function setObjectStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value))
}

export function getParticipant(uid) {
  const participants = getObjectStorage('participants');
  return participants[uid];
}

export function getAllParticipants() {
  const participants = getObjectStorage('participants');
  return participants;
}

export function setParticipant(participant) {
  const participants = getObjectStorage('participants');
  participants[participant.uid] = participant;
  setObjectStorage('participants', participants);
}

export function removeParticipant(uid) {
  const participants = getObjectStorage('participants');
  delete participants[uid];
  setObjectStorage('participants', participants);
}