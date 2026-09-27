export class DanglePhysics {
  constructor(options = {}) {
    this.anchorX =
      typeof options.anchorX === 'number'
        ? options.anchorX
        : window.innerWidth - 180;

    this.anchorY =
      typeof options.anchorY === 'number'
        ? options.anchorY
        : 0;

    this.restLength =
      typeof options.restLength === 'number'
        ? Math.max(40, options.restLength)
        : 220;

    this.maxStretch = 340;

    this.mass = 1.6;
    this.gravity = 1200;
    this.airDamping = 0.994;

    this.x = this.anchorX;
    this.y = this.anchorY + this.restLength;

    this.vx = 0;
    this.vy = 0;

    this.angle = 0;
    this.angularVelocity = 0;

    this.isGrabbed = false;

    this.dragOffset = {
      x: 0,
      y: 0
    };

    this.velocitySamples = [];

    this.sampleWindow = 6;
    this.lastSampleTime = 0;

    this.lastRecordedX = this.x;
    this.lastRecordedY = this.y;

    this.stretchRatio = 0;

    this.hasTriggeredOnCurrentPull = false;

    this.onMaxStretch =
      typeof options.onMaxStretch === 'function'
        ? options.onMaxStretch
        : null;

    // ----------------------------------------------------------
    // Rope
    // ----------------------------------------------------------

    this.numNodes = 14;

    this.segmentRestLength =
      this.restLength /
      (this.numNodes - 1);

    this.nodes = [];

    this.initRope();
  }

  // ------------------------------------------------------------
  // Initialize rope
  // ------------------------------------------------------------

  initRope() {
    this.nodes = [];

    for (
      let i = 0;
      i < this.numNodes;
      i++
    ) {
      const t =
        i /
        (this.numNodes - 1);

      const px = this.anchorX;

      const py =
        this.anchorY +
        this.restLength * t;

      this.nodes.push({
        x: px,
        y: py,

        oldX: px,
        oldY: py,

        mass:
          i === 0
            ? 0
            : 0.08
      });
    }

    // Make sure the charm position and
    // final rope node always agree.
    this.x = this.anchorX;
    this.y =
      this.anchorY +
      this.restLength;

    this.lastRecordedX = this.x;
    this.lastRecordedY = this.y;
  }

  // ------------------------------------------------------------
  // Anchor
  // ------------------------------------------------------------

  setAnchor(x, y) {
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y)
    ) {
      return;
    }

    const dx =
      x - this.anchorX;

    const dy =
      y - this.anchorY;

    this.anchorX = x;
    this.anchorY = y;

    for (const node of this.nodes) {
      node.x += dx;
      node.oldX += dx;

      node.y += dy;
      node.oldY += dy;
    }

    this.x += dx;
    this.y += dy;

    this.lastRecordedX = this.x;
    this.lastRecordedY = this.y;
  }

  // ------------------------------------------------------------
  // Rope length
  // ------------------------------------------------------------

  setRestLength(newLength) {
    if (
      !Number.isFinite(newLength)
    ) {
      return;
    }

    this.restLength =
      Math.max(40, newLength);

    this.segmentRestLength =
      this.restLength /
      (this.numNodes - 1);

    for (
      let i = 0;
      i < this.numNodes;
      i++
    ) {
      const t =
        i /
        (this.numNodes - 1);

      const y =
        this.anchorY +
        this.restLength * t;

      this.nodes[i].y = y;
      this.nodes[i].oldY = y;

      if (i === 0) {
        this.nodes[i].x =
          this.anchorX;

        this.nodes[i].oldX =
          this.anchorX;
      }
    }

    if (!this.isGrabbed) {
      this.x =
        this.anchorX;

      this.y =
        this.anchorY +
        this.restLength;

      this.vx = 0;
      this.vy = 0;

      this.angle = 0;
      this.angularVelocity = 0;

      this.lastRecordedX =
        this.x;

      this.lastRecordedY =
        this.y;
    }

    // Always keep the final node attached
    // to the current charm position.
    const last =
      this.nodes[
        this.nodes.length - 1
      ];

    if (last) {
      last.x = this.x;
      last.y = this.y;

      last.oldX = this.x;
      last.oldY = this.y;
    }
  }

  // ------------------------------------------------------------
  // Grab
  // ------------------------------------------------------------

  grab(
    pointerScreenX,
    pointerScreenY
  ) {
    if (
      !Number.isFinite(pointerScreenX) ||
      !Number.isFinite(pointerScreenY)
    ) {
      return;
    }

    this.isGrabbed = true;

    this.hasTriggeredOnCurrentPull =
      false;

    this.stretchRatio = 0;

    this.vx = 0;
    this.vy = 0;

    this.angularVelocity = 0;

    this.dragOffset.x =
      this.x -
      pointerScreenX;

    this.dragOffset.y =
      this.y -
      pointerScreenY;

    this.velocitySamples = [];

    const now =
      performance.now();

    this.lastSampleTime = now;

    this.lastRecordedX =
      this.x;

    this.lastRecordedY =
      this.y;
  }

  // ------------------------------------------------------------
  // Drag
  // ------------------------------------------------------------

  dragTo(
    pointerScreenX,
    pointerScreenY
  ) {
    if (!this.isGrabbed) {
      return;
    }

    if (
      !Number.isFinite(pointerScreenX) ||
      !Number.isFinite(pointerScreenY)
    ) {
      return;
    }

    const now =
      performance.now();

    const elapsed =
      now -
      this.lastSampleTime;

    const dt =
      elapsed / 1000;

    const rawX =
      pointerScreenX +
      this.dragOffset.x;

    const rawY =
      pointerScreenY +
      this.dragOffset.y;

    const dx =
      rawX -
      this.anchorX;

    const dy =
      Math.max(
        15,
        rawY -
          this.anchorY
      );

    const dist =
      Math.hypot(
        dx,
        dy
      );

    // ----------------------------------------------------------
    // Keep the charm within the allowed rope stretch
    // ----------------------------------------------------------

    if (
      dist >
      this.restLength
    ) {
      const extra =
        dist -
        this.restLength;

      const allowedExtra =
        this.maxStretch *
        (
          1 -
          Math.exp(
            -extra /
              (
                this.maxStretch *
                0.75
              )
          )
        );

      const constrainedDist =
        this.restLength +
        allowedExtra;

      const ratio =
        constrainedDist /
        Math.max(
          dist,
          0.001
        );

      this.x =
        this.anchorX +
        dx * ratio;

      this.y =
        this.anchorY +
        dy * ratio;
    } else {
      this.x = rawX;
      this.y = rawY;
    }

    // ----------------------------------------------------------
    // Stretch detection
    // ----------------------------------------------------------

    const verticalExtra =
      Math.max(
        0,
        this.y -
          (
            this.anchorY +
            this.restLength
          )
      );

    const isPullingStraightDown =
      Math.abs(
        this.x -
          this.anchorX
      ) <= 85;

    if (
      isPullingStraightDown &&
      verticalExtra > 0
    ) {
      this.stretchRatio =
        Math.min(
          1,
          verticalExtra /
            (
              this.maxStretch *
              0.85
            )
        );

      if (
        this.stretchRatio >= 0.95 &&
        !this.hasTriggeredOnCurrentPull
      ) {
        this.hasTriggeredOnCurrentPull =
          true;

        if (
          typeof this.onMaxStretch ===
          'function'
        ) {
          this.onMaxStretch();
        }
      }
    } else {
      this.stretchRatio = 0;
    }

    // ----------------------------------------------------------
    // Visual angle
    // ----------------------------------------------------------

    this.angle =
      Math.atan2(
        this.x -
          this.anchorX,
        this.y -
          this.anchorY
      ) * 0.45;

    // ----------------------------------------------------------
    // Velocity sampling
    // ----------------------------------------------------------

    if (
      dt > 0.006 &&
      dt < 0.2
    ) {
      const vx =
        (
          this.x -
          this.lastRecordedX
        ) / dt;

      const vy =
        (
          this.y -
          this.lastRecordedY
        ) / dt;

      this.velocitySamples.push({
        vx,
        vy,
        time: now
      });

      if (
        this.velocitySamples.length >
        this.sampleWindow
      ) {
        this.velocitySamples.shift();
      }

      this.lastRecordedX =
        this.x;

      this.lastRecordedY =
        this.y;

      this.lastSampleTime =
        now;
    }
  }

  // ------------------------------------------------------------
  // Release
  // ------------------------------------------------------------

  release() {
    if (!this.isGrabbed) {
      return;
    }

    this.isGrabbed = false;

    this.stretchRatio = 0;

    if (
      this.velocitySamples.length >
      0
    ) {
      let totalWeight = 0;
      let sumVx = 0;
      let sumVy = 0;

      this.velocitySamples.forEach(
        (sample, index) => {
          const weight =
            Math.pow(
              1.8,
              index
            );

          sumVx +=
            sample.vx *
            weight;

          sumVy +=
            sample.vy *
            weight;

          totalWeight +=
            weight;
        }
      );

      if (
        totalWeight >
        0
      ) {
        this.vx =
          sumVx /
          totalWeight;

        this.vy =
          sumVy /
          totalWeight;
      }

      const maxSpeed =
        4000;

      const speed =
        Math.hypot(
          this.vx,
          this.vy
        );

      if (
        speed >
        maxSpeed
      ) {
        const scale =
          maxSpeed /
          speed;

        this.vx *= scale;
        this.vy *= scale;
      }
    }

    this.velocitySamples = [];

    this.lastRecordedX =
      this.x;

    this.lastRecordedY =
      this.y;
  }

  // ------------------------------------------------------------
  // Main physics step
  // ------------------------------------------------------------

  step(dt) {
    if (
      !Number.isFinite(dt) ||
      dt <= 0
    ) {
      return;
    }

    if (!this.isGrabbed) {
      this.stretchRatio = 0;

      const dx =
        this.x -
        this.anchorX;

      const dy =
        this.y -
        this.anchorY;

      const dist =
        Math.hypot(
          dx,
          dy
        );

      let fx = 0;

      let fy =
        this.gravity *
        this.mass;

      // --------------------------------------------------------
      // Rope tension
      // --------------------------------------------------------

      if (
        dist >
          this.restLength &&
        dist >
          0.001
      ) {
        const stretch =
          dist -
          this.restLength;

        const unitX =
          dx /
          dist;

        const unitY =
          dy /
          dist;

        const tensionForce =
          (
            stretch *
            640
          ) +
          (
            Math.pow(
              stretch,
              1.4
            ) *
            9.5
          );

        fx -=
          tensionForce *
          unitX;

        fy -=
          tensionForce *
          unitY;

        // Radial damping
        const radialVel =
          this.vx *
            unitX +
          this.vy *
            unitY;

        fx -=
          radialVel *
          22 *
          unitX;

        fy -=
          radialVel *
          22 *
          unitY;
      }

      // --------------------------------------------------------
      // Acceleration
      // --------------------------------------------------------

      const ax =
        fx /
        this.mass;

      const ay =
        fy /
        this.mass;

      this.vx +=
        ax *
        dt;

      this.vy +=
        ay *
        dt;

      // --------------------------------------------------------
      // Air damping
      // --------------------------------------------------------

      const speed =
        Math.hypot(
          this.vx,
          this.vy
        );

      const dragFactor =
        1 -
        Math.min(
          0.08,
          (
            0.00007 *
            speed
          ) *
            dt *
            60
        );

      this.vx *=
        this.airDamping *
        dragFactor;

      this.vy *=
        this.airDamping *
        dragFactor;

      // --------------------------------------------------------
      // Position
      // --------------------------------------------------------

      this.x +=
        this.vx *
        dt;

      this.y +=
        this.vy *
        dt;

      // --------------------------------------------------------
      // Horizontal screen bounds
      // --------------------------------------------------------

      const margin = 42;

      if (
        this.x <
        margin
      ) {
        this.x =
          margin;

        this.vx =
          -this.vx *
          0.45;
      } else if (
        this.x >
        window.innerWidth -
          margin
      ) {
        this.x =
          window.innerWidth -
          margin;

        this.vx =
          -this.vx *
          0.45;
      }

      // --------------------------------------------------------
      // Angular motion
      // --------------------------------------------------------

      const targetAngle =
        Math.atan2(
          dx,
          dy
        );

      let angleDiff =
        targetAngle -
        this.angle;

      // Normalize angle difference
      // to prevent sudden rotations.
      while (
        angleDiff >
        Math.PI
      ) {
        angleDiff -=
          Math.PI * 2;
      }

      while (
        angleDiff <
        -Math.PI
      ) {
        angleDiff +=
          Math.PI * 2;
      }

      this.angularVelocity +=
        angleDiff *
        40 *
        dt;

      this.angularVelocity *=
        Math.pow(
          0.95,
          dt * 60
        );

      this.angle +=
        this.angularVelocity *
        dt;

      // --------------------------------------------------------
      // Settle completely
      // --------------------------------------------------------

      if (
        Math.hypot(
          this.vx,
          this.vy
        ) < 0.7 &&
        Math.abs(
          this.x -
            this.anchorX
        ) < 0.5 &&
        Math.abs(
          this.y -
            (
              this.anchorY +
              this.restLength
            )
        ) < 0.5
      ) {
        this.x =
          this.anchorX;

        this.y =
          this.anchorY +
          this.restLength;

        this.vx = 0;
        this.vy = 0;

        this.angle = 0;
        this.angularVelocity = 0;
      }
    }

    // ----------------------------------------------------------
    // Rope nodes
    // ----------------------------------------------------------

    this.stepRopeNodes(dt);
  }

  // ------------------------------------------------------------
  // Rope node simulation
  // ------------------------------------------------------------

  stepRopeNodes(dt) {
    if (
      !this.nodes ||
      !this.nodes.length
    ) {
      return;
    }

    // Anchor is fixed.
    this.nodes[0].x =
      this.anchorX;

    this.nodes[0].y =
      this.anchorY;

    // Charm is the final rope point.
    const last =
      this.nodes[
        this.nodes.length - 1
      ];

    last.x = this.x;
    last.y = this.y;

    // ----------------------------------------------------------
    // Integrate rope nodes
    // ----------------------------------------------------------

    const ropeGravity =
      580 *
      dt *
      dt;

    const ropeDrag =
      0.94;

    for (
      let i = 1;
      i <
        this.nodes.length - 1;
      i++
    ) {
      const node =
        this.nodes[i];

      const vx =
        (
          node.x -
          node.oldX
        ) *
        ropeDrag;

      const vy =
        (
          node.y -
          node.oldY
        ) *
        ropeDrag;

      node.oldX =
        node.x;

      node.oldY =
        node.y;

      node.x += vx;

      node.y +=
        vy +
        ropeGravity;
    }

    // ----------------------------------------------------------
    // Constraint solving
    // ----------------------------------------------------------

    for (
      let iteration = 0;
      iteration < 10;
      iteration++
    ) {
      for (
        let i = 0;
        i <
          this.nodes.length - 1;
        i++
      ) {
        const n1 =
          this.nodes[i];

        const n2 =
          this.nodes[i + 1];

        const dx =
          n2.x -
          n1.x;

        const dy =
          n2.y -
          n1.y;

        const distance =
          Math.hypot(
            dx,
            dy
          );

        if (
          distance <
          0.0001
        ) {
          continue;
        }

        const difference =
          (
            distance -
            this.segmentRestLength
          ) /
          distance;

        // Anchor segment
        if (i === 0) {
          n2.x -=
            dx *
            difference *
            0.9;

          n2.y -=
            dy *
            difference *
            0.9;
        }

        // Final segment attached to charm
        else if (
          i ===
          this.nodes.length - 2
        ) {
          n1.x +=
            dx *
            difference *
            0.85;

          n1.y +=
            dy *
            difference *
            0.85;

          n2.x -=
            dx *
            difference *
            0.15;

          n2.y -=
            dy *
            difference *
            0.15;

          // Reattach final node exactly.
          n2.x =
            this.x;

          n2.y =
            this.y;
        }

        // Middle segments
        else {
          n1.x +=
            dx *
            difference *
            0.5;

          n1.y +=
            dy *
            difference *
            0.5;

          n2.x -=
            dx *
            difference *
            0.5;

          n2.y -=
            dy *
            difference *
            0.5;
        }
      }

      // --------------------------------------------------------
      // Smooth rope shape
      // --------------------------------------------------------

      for (
        let i = 1;
        i <
          this.nodes.length - 1;
        i++
      ) {
        const previous =
          this.nodes[i - 1];

        const current =
          this.nodes[i];

        const next =
          this.nodes[i + 1];

        const midX =
          (
            previous.x +
            next.x
          ) *
          0.5;

        const midY =
          (
            previous.y +
            next.y
          ) *
          0.5;

        current.x +=
          (
            midX -
            current.x
          ) *
          0.04;

        current.y +=
          (
            midY -
            current.y
          ) *
          0.04;
      }

      // Re-lock anchor and charm
      // after every solver iteration.
      this.nodes[0].x =
        this.anchorX;

      this.nodes[0].y =
        this.anchorY;

      last.x =
        this.x;

      last.y =
        this.y;
    }
  }
}