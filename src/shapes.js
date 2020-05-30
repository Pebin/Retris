import {Position} from "./index";

export class BasicShape {
  constructor() {
    this.basePosition = null
    this.rotationNumber = 0
    this.rotations = []
    this.stored_positions = null
    this.color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')'
  }

  move(x, y) {
    this.basePosition.x += x
    this.basePosition.y += y
    this.stored_positions = this.getRotation(this.rotationNumber)
  }

  positions() {
    if (!this.stored_positions){
      this.stored_positions = this.getRotation(this.rotationNumber)
    }
    return this.stored_positions
  }

  getRotation(rotationNumber) {
    return this.rotations[rotationNumber].map(position => {
      return new Position(position.x + this.basePosition.x,
        position.y + this.basePosition.y)
    })
  }

  getNextRotation() {
    return this.getRotation(this.getNextRotationNumber())
  }

  rotate() {
    this.rotationNumber = this.getNextRotationNumber()
    this.stored_positions = this.getRotation(this.rotationNumber)
  }

  getNextRotationNumber() {
    let rotation_number = this.rotationNumber + 1
    if (rotation_number === this.rotations.length) {
      rotation_number = 0
    }
    return rotation_number
  }
}

export class Shape1 extends BasicShape {
  // x
  // X
  // x
  // x
  constructor() {
    super();
    this.basePosition = new Position(3, 1)
    this.rotations = [
      [
        new Position(0, -1),
        new Position(0, 0),
        new Position(0, 1),
        new Position(0, 2)
      ],
      [
        new Position(-1, 0),
        new Position(0, 0),
        new Position(1, 0),
        new Position(2, 0),
      ],
    ]
  }
}

export class Shape2 extends BasicShape {
  //
  // Xx
  // xx
  //
  constructor() {
    super()
    this.basePosition = new Position(3, 0)
    this.rotations = [
      [
        new Position(0, 0),
        new Position(0, 1),
        new Position(1, 0),
        new Position(1, 1)
      ],
    ]
  }
}

export class Shape3 extends BasicShape {
  //
  //  x
  // xXx
  //
  constructor() {
    super()
    this.basePosition = new Position(3, 1)
    this.rotations = [
      [
        new Position(-1, 0),
        new Position(0, 0),
        new Position(0, -1),
        new Position(1, 0)
      ],
      [
        new Position(0, -1),
        new Position(0, 0),
        new Position(1, 0),
        new Position(0, 1)
      ],
      [
        new Position(-1, 0),
        new Position(0, 0),
        new Position(0, 1),
        new Position(1, 0)
      ],
      [
        new Position(0, -1),
        new Position(0, 0),
        new Position(-1, 0),
        new Position(0, 1)
      ],
    ]
  }
}

export class Shape4 extends BasicShape {
  //  x
  //  X
  //  xx
  //
  constructor() {
    super()
    this.basePosition = new Position(3, 1)
    this.rotations = [
      [
        new Position(0, -1),
        new Position(0, 0),
        new Position(0, 1),
        new Position(1, 1)
      ],
      [
        new Position(1, 0),
        new Position(0, 0),
        new Position(-1, 0),
        new Position(-1, 1)
      ],
      [
        new Position(0, 1),
        new Position(0, 0),
        new Position(0, -1),
        new Position(-1, -1)
      ],
      [
        new Position(-1, 0),
        new Position(0, 0),
        new Position(1, 0),
        new Position(1, -1)
      ],
    ]
  }
}

export class Shape5 extends BasicShape {
  //   x
  //   X
  //  xx
  //
  constructor() {
    super()
    this.basePosition = new Position(4, 1)
    this.rotations = [
      [
        new Position(0, -1),
        new Position(0, 0),
        new Position(0, 1),
        new Position(-1, 1)
      ],
      [
        new Position(1, 0),
        new Position(0, 0),
        new Position(-1, 0),
        new Position(-1, -1)
      ],
      [
        new Position(0, 1),
        new Position(0, 0),
        new Position(0, -1),
        new Position(1, -1)
      ],
      [
        new Position(-1, 0),
        new Position(0, 0),
        new Position(1, 0),
        new Position(1, 1)
      ],
    ]
  }
}

export class Shape6 extends BasicShape {
  //   x
  //  Xx
  //  x
  //
  constructor() {
    super()
    this.basePosition = new Position(3, 1)
    this.rotations = [
      [
        new Position(0, 1),
        new Position(0, 0),
        new Position(1, 0),
        new Position(1, -1)
      ],
      [
        new Position(-1, 0),
        new Position(0, 0),
        new Position(0, 1),
        new Position(1, 1)
      ],
    ]
  }
}

export class Shape7 extends BasicShape {
  //  x
  //  Xx
  //   x
  //
  constructor() {
    super()
    this.basePosition = new Position(3, 1)
    this.rotations = [
      [
        new Position(0, -1),
        new Position(0, 0),
        new Position(1, 0),
        new Position(1, 1)
      ],
      [
        new Position(1, 0),
        new Position(0, 0),
        new Position(0, 1),
        new Position(-1, 1)
      ],
    ]
  }
}