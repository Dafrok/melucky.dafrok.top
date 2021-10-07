export class Poker {
  constructor({uid, uname, avatar}) {
      this.uid = uid;
      this.uname = uname;
      this.avatar = avatar,
      this.selected = false;
      this.sign = parseInt(Math.random() * 4, 10);
      this.number = parseInt(Math.random() * 13, 10);
      this.dead = false;
  }
}