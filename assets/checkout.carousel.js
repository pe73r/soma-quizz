function throttle(callback, time) {
  if (!this.throttlePause) {
    this.throttlePause = true;
    setTimeout(() => {
      callback();
      this.throttlePause = false;
    }, time);
  }
}

const getProps = (element) => {
  return element.propsDefinition.reduce((acc, [prop, type]) => {
    let value = element.getAttribute(prop);
    if (value) {
      switch (type) {
        case "string": {
          break;
        }
        case "boolean": {
          value = value === "true";
          break;
        }
        case "number": {
          value = Number(value);
          break;
        }
      }
      acc[prop] = value;
    }
    return acc;
  }, {});
};
const H = HTMLElement;

function Alignment(align, viewSize) {
  var predefined = { start, center, end },
    self;
  function start() {
    return 0;
  }
  function center(n) {
    return end(n) / 2;
  }
  function end(n) {
    return viewSize - n;
  }
  function percent() {
    return viewSize * Number(align);
  }
  function measure(n) {
    return "number" == typeof align ? percent() : predefined[align](n);
  }
  return { measure: measure };
}
function Animation(callback) {
  var animationFrame = 0,
    self;
  function ifAnimating(active, cb) {
    return function () {
      active === !!animationFrame && cb();
    };
  }
  function start() {
    animationFrame = window.requestAnimationFrame(callback);
  }
  function stop() {
    window.cancelAnimationFrame(animationFrame), (animationFrame = 0);
  }
  return { proceed: ifAnimating(!0, start), start: ifAnimating(!1, start), stop: ifAnimating(!0, stop) };
}
function Axis(axis, direction) {
  var scroll = "y" === axis ? "y" : "x",
    cross = "y" === axis ? "x" : "y",
    startEdge = getStartEdge(),
    endEdge = getEndEdge(),
    self;
  function measureSize(rect) {
    var width = rect.width,
      height = rect.height;
    return "x" === scroll ? width : height;
  }
  function getStartEdge() {
    return "y" === scroll ? "top" : "rtl" === direction ? "right" : "left";
  }
  function getEndEdge() {
    return "y" === scroll ? "bottom" : "rtl" === direction ? "left" : "right";
  }
  return { scroll: scroll, cross: cross, startEdge: startEdge, endEdge: endEdge, measureSize: measureSize };
}
function map(value, iStart, iStop, oStart, oStop) {
  return oStart + ((value - iStart) / (iStop - iStart)) * (oStop - oStart);
}
function mathAbs(n) {
  return Math.abs(n);
}
function mathSign(n) {
  return n ? n / mathAbs(n) : 0;
}
function deltaAbs(valueB, valueA) {
  return mathAbs(valueB - valueA);
}
function factorAbs(valueB, valueA) {
  if (0 === valueB || 0 === valueA) return 0;
  if (mathAbs(valueB) <= mathAbs(valueA)) return 0;
  var diff = deltaAbs(mathAbs(valueB), mathAbs(valueA));
  return mathAbs(diff / valueB);
}
function roundToDecimals(decimalPoints) {
  var pow = Math.pow(10, decimalPoints);
  return function (n) {
    return Math.round(n * pow) / pow;
  };
}
function debounce(callback, time) {
  var timeout = 0;
  return function () {
    window.clearTimeout(timeout), (timeout = window.setTimeout(callback, time) || 0);
  };
}
function arrayGroup(array, size) {
  for (var groups = [], i = 0; i < array.length; i += size) groups.push(array.slice(i, i + size));
  return groups;
}
function arrayKeys(array) {
  return Object.keys(array).map(Number);
}
function arrayLast(array) {
  return array[arrayLastIndex(array)];
}
function arrayLastIndex(array) {
  return Math.max(0, array.length - 1);
}
function Limit(min, max) {
  var length = mathAbs(min - max),
    self;
  function reachedMin(n) {
    return n < min;
  }
  function reachedMax(n) {
    return n > max;
  }
  function reachedAny(n) {
    return reachedMin(n) || reachedMax(n);
  }
  function constrain(n) {
    return reachedAny(n) ? (reachedMin(n) ? min : max) : n;
  }
  function removeOffset(n) {
    return length ? n - length * Math.ceil((n - max) / length) : n;
  }
  return {
    length,
    max,
    min,
    constrain,
    reachedAny,
    reachedMax,
    reachedMin,
    removeOffset
  };
}
function Counter(max, start, loop) {
  var _a = Limit(0, max),
    min = _a.min,
    constrain = _a.constrain,
    loopEnd = max + 1,
    counter = withinLimit(start);
  function withinLimit(n) {
    return loop ? mathAbs((loopEnd + n) % loopEnd) : constrain(n);
  }
  function get() {
    return counter;
  }
  function set(n) {
    return (counter = withinLimit(n)), self;
  }
  function add(n) {
    return set(get() + n);
  }
  function clone() {
    return Counter(max, get(), loop);
  }
  var self = { add: add, clone: clone, get: get, set: set, min: min, max: max };
  return self;
}
function Direction(direction) {
  var sign = "rtl" === direction ? -1 : 1,
    self;
  function apply(n) {
    return n * sign;
  }
  return { apply: apply };
}
function EventStore() {
  var listeners = [];
  function add(node, type, handler, options) {
    return (
      void 0 === options && (options = !1),
      node.addEventListener(type, handler, options),
      listeners.push(function () {
        return node.removeEventListener(type, handler, options);
      }),
      self
    );
  }
  function removeAll() {
    return (
      (listeners = listeners.filter(function (remove) {
        return remove();
      })),
      self
    );
  }
  var self = { add: add, removeAll: removeAll };
  return self;
}
function Vector1D(value) {
  var vector = value;
  function get() {
    return vector;
  }
  function set(n) {
    return (vector = readNumber(n)), self;
  }
  function add(n) {
    return (vector += readNumber(n)), self;
  }
  function subtract(n) {
    return (vector -= readNumber(n)), self;
  }
  function multiply(n) {
    return (vector *= n), self;
  }
  function divide(n) {
    return (vector /= n), self;
  }
  function normalize() {
    return 0 !== vector && divide(vector), self;
  }
  function readNumber(n) {
    return "number" == typeof n ? n : n.get();
  }
  var self = {
    add: add,
    divide: divide,
    get: get,
    multiply: multiply,
    normalize: normalize,
    set: set,
    subtract: subtract
  };
  return self;
}
function DragHandler(
  axis,
  direction,
  rootNode,
  target,
  dragFree,
  dragTracker,
  location,
  animation,
  scrollTo,
  scrollBody,
  scrollTarget,
  index,
  events,
  loop,
  skipSnaps
) {
  var crossAxis = axis.cross,
    focusNodes = ["INPUT", "SELECT", "TEXTAREA"],
    dragStartPoint = Vector1D(0),
    activationEvents = EventStore(),
    interactionEvents = EventStore(),
    snapForceBoost = { mouse: 300, touch: 400 },
    freeForceBoost = { mouse: 500, touch: 600 },
    baseSpeed = dragFree ? 5 : 16,
    baseMass = 1,
    dragThreshold = 20,
    startScroll = 0,
    startCross = 0,
    pointerIsDown = !1,
    preventScroll = !1,
    preventClick = !1,
    isMouse = !1,
    self;
  function addActivationEvents() {
    var node = rootNode;
    activationEvents
      .add(node, "touchmove", function () {})
      .add(node, "touchend", function () {})
      .add(node, "touchstart", down)
      .add(node, "mousedown", down)
      .add(node, "touchcancel", up)
      .add(node, "contextmenu", up)
      .add(node, "click", click);
  }
  function addInteractionEvents() {
    var node = isMouse ? document : rootNode;
    interactionEvents
      .add(node, "touchmove", move)
      .add(node, "touchend", up)
      .add(node, "mousemove", move)
      .add(node, "mouseup", up);
  }
  function removeAllEvents() {
    activationEvents.removeAll(), interactionEvents.removeAll();
  }
  function isFocusNode(node) {
    var name = node.nodeName || "";
    return focusNodes.indexOf(name) > -1;
  }
  function forceBoost() {
    var boost, type;
    return (dragFree ? freeForceBoost : snapForceBoost)[isMouse ? "mouse" : "touch"];
  }
  function allowedForce(force, targetChanged) {
    var next = index.clone().add(-1 * mathSign(force)),
      isEdge = next.get() === index.min || next.get() === index.max,
      baseForce = scrollTarget.byDistance(force, !dragFree).distance;
    return dragFree || mathAbs(force) < 20
      ? baseForce
      : !loop && isEdge
      ? 0.4 * baseForce
      : skipSnaps && targetChanged
      ? 0.5 * baseForce
      : scrollTarget.byIndex(next.get(), 0).distance;
  }
  function down(evt) {
    if (!(isMouse = "mousedown" === evt.type) || 0 === evt.button) {
      var isMoving = deltaAbs(target.get(), location.get()) >= 2,
        clearPreventClick = isMouse || !isMoving,
        isNotFocusNode = !isFocusNode(evt.target),
        preventDefault = isMoving || (isMouse && isNotFocusNode);
      (pointerIsDown = !0),
        dragTracker.pointerDown(evt),
        dragStartPoint.set(target),
        target.set(location),
        scrollBody.useBaseMass().useSpeed(80),
        addInteractionEvents(),
        (startScroll = dragTracker.readPoint(evt)),
        (startCross = dragTracker.readPoint(evt, crossAxis)),
        events.emit("pointerDown"),
        clearPreventClick && (preventClick = !1),
        preventDefault && evt.preventDefault();
    }
  }
  function move(evt) {
    if (!preventScroll && !isMouse) {
      if (!evt.cancelable) return up(evt);
      var lastScroll = dragTracker.readPoint(evt),
        lastCross = dragTracker.readPoint(evt, crossAxis),
        diffScroll = deltaAbs(lastScroll, startScroll),
        diffCross = deltaAbs(lastCross, startCross);
      if (!(preventScroll = diffScroll > diffCross) && !preventClick) return up(evt);
    }
    var diff = dragTracker.pointerMove(evt);
    !preventClick && diff && (preventClick = !0),
      animation.start(),
      target.add(direction.apply(diff)),
      evt.preventDefault();
  }
  function up(evt) {
    var currentLocation,
      targetChanged = scrollTarget.byDistance(0, !1).index !== index.get(),
      rawForce = dragTracker.pointerUp(evt) * forceBoost(),
      force = allowedForce(direction.apply(rawForce), targetChanged),
      forceFactor = factorAbs(rawForce, force),
      isMoving = deltaAbs(target.get(), dragStartPoint.get()) >= 0.5,
      isVigorous = targetChanged && forceFactor > 0.75,
      isBelowThreshold = mathAbs(rawForce) < 20,
      speed = isVigorous ? 10 : baseSpeed,
      mass = isVigorous ? 1 + 2.5 * forceFactor : 1;
    isMoving && !isMouse && (preventClick = !0),
      (preventScroll = !1),
      (pointerIsDown = !1),
      interactionEvents.removeAll(),
      scrollBody.useSpeed(isBelowThreshold ? 9 : speed).useMass(mass),
      scrollTo.distance(force, !dragFree),
      (isMouse = !1),
      events.emit("pointerUp");
  }
  function click(evt) {
    preventClick && evt.preventDefault();
  }
  function clickAllowed() {
    return !preventClick;
  }
  function pointerDown() {
    return pointerIsDown;
  }
  return {
    addActivationEvents,
    clickAllowed,
    pointerDown,
    removeAllEvents
  };
}
function DragTracker(axis, pxToPercent) {
  var logInterval = 170,
    startEvent,
    lastEvent,
    self;
  function isTouchEvent(evt) {
    return "undefined" != typeof TouchEvent && evt instanceof TouchEvent;
  }
  function readTime(evt) {
    return evt.timeStamp;
  }
  function readPoint(evt, evtAxis) {
    var property,
      coord = "client" + ("x" === (evtAxis || axis.scroll) ? "X" : "Y");
    return (isTouchEvent(evt) ? evt.touches[0] : evt)[coord];
  }
  function pointerDown(evt) {
    return (startEvent = evt), (lastEvent = evt), pxToPercent.measure(readPoint(evt));
  }
  function pointerMove(evt) {
    var diff = readPoint(evt) - readPoint(lastEvent),
      expired = readTime(evt) - readTime(startEvent) > 170;
    return (lastEvent = evt), expired && (startEvent = evt), pxToPercent.measure(diff);
  }
  function pointerUp(evt) {
    if (!startEvent || !lastEvent) return 0;
    var diffDrag = readPoint(lastEvent) - readPoint(startEvent),
      diffTime = readTime(evt) - readTime(startEvent),
      expired = readTime(evt) - readTime(lastEvent) > 170,
      force = diffDrag / diffTime,
      isFlick;
    return diffTime && !expired && mathAbs(force) > 0.1 ? pxToPercent.measure(force) : 0;
  }
  return {
    isTouchEvent,
    pointerDown,
    pointerMove,
    pointerUp,
    readPoint
  };
}
function PxToPercent(viewInPx) {
  var totalPercent = 100,
    self;
  function measure(n) {
    return 0 === viewInPx ? 0 : (n / viewInPx) * 100;
  }
  return { measure: measure, totalPercent: 100 };
}
function ScrollBody(location, baseSpeed, baseMass) {
  var roundToTwoDecimals = roundToDecimals(2),
    velocity = Vector1D(0),
    acceleration = Vector1D(0),
    attraction = Vector1D(0),
    attractionDirection = 0,
    speed = baseSpeed,
    mass = baseMass;
  function update() {
    velocity.add(acceleration), location.add(velocity), acceleration.multiply(0);
  }
  function applyForce(force) {
    force.divide(mass), acceleration.add(force);
  }
  function seek(target) {
    attraction.set(target).subtract(location);
    var magnitude = map(attraction.get(), 0, 100, 0, speed);
    return (
      (attractionDirection = mathSign(attraction.get())),
      attraction.normalize().multiply(magnitude).subtract(velocity),
      applyForce(attraction),
      self
    );
  }
  function settle(target) {
    var diff = target.get() - location.get(),
      hasSettled = !roundToTwoDecimals(diff);
    return hasSettled && location.set(target), hasSettled;
  }
  function direction() {
    return attractionDirection;
  }
  function useBaseSpeed() {
    return useSpeed(baseSpeed);
  }
  function useBaseMass() {
    return useMass(baseMass);
  }
  function useSpeed(n) {
    return (speed = n), self;
  }
  function useMass(n) {
    return (mass = n), self;
  }
  var self = {
    direction,
    seek,
    settle,
    update,
    useBaseMass,
    useBaseSpeed,
    useMass,
    useSpeed
  };
  return self;
}
function ScrollBounds(limit, location, target, scrollBody) {
  var pullBackThreshold = 10,
    edgeOffsetTolerance = 50,
    maxFriction = 0.85,
    disabled = !1,
    self;
  function shouldConstrain() {
    return !disabled && !!limit.reachedAny(target.get()) && !!limit.reachedAny(location.get());
  }
  function constrain(pointerDown) {
    if (shouldConstrain()) {
      var edge = limit.reachedMin(location.get()) ? "min" : "max",
        diffToEdge = mathAbs(limit[edge] - location.get()),
        diffToTarget = target.get() - location.get(),
        friction = Math.min(diffToEdge / 50, 0.85);
      target.subtract(diffToTarget * friction),
        !pointerDown &&
          mathAbs(diffToTarget) < 10 &&
          (target.set(limit.constrain(target.get())), scrollBody.useSpeed(10).useMass(3));
    }
  }
  function toggleActive(active) {
    disabled = !active;
  }

  return { constrain, toggleActive };
}
function ScrollContain(viewSize, contentSize, snaps, snapsAligned, containScroll) {
  var scrollBounds = Limit(-contentSize + viewSize, snaps[0]),
    snapsBounded = snapsAligned.map(scrollBounds.constrain),
    snapsContained,
    self;
  function findDuplicates() {
    var startSnap = snapsBounded[0],
      endSnap = arrayLast(snapsBounded),
      min,
      max;
    return Limit(snapsBounded.lastIndexOf(startSnap), snapsBounded.indexOf(endSnap) + 1);
  }
  function measureContained() {
    if (contentSize <= viewSize) return [scrollBounds.max];
    if ("keepSnaps" === containScroll) return snapsBounded;
    var _a = findDuplicates(),
      min = _a.min,
      max = _a.max;
    return snapsBounded.slice(min, max);
  }
  return { snapsContained: measureContained() };
}
function ScrollLimit(contentSize, scrollSnaps, loop) {
  var limit, self;
  function measureLimit() {
    var startSnap = scrollSnaps[0],
      endSnap = arrayLast(scrollSnaps),
      min,
      max;

    return Limit(loop ? startSnap - contentSize : endSnap, startSnap);
  }
  return { limit: measureLimit() };
}
function ScrollLooper(contentSize, pxToPercent, limit, location, vectors) {
  var min,
    max,
    _a = Limit(limit.min + pxToPercent.measure(0.1), limit.max + pxToPercent.measure(0.1)),
    reachedMin = _a.reachedMin,
    reachedMax = _a.reachedMax,
    self;
  function shouldLoop(direction) {
    return 1 === direction ? reachedMax(location.get()) : -1 === direction && reachedMin(location.get());
  }
  function loop(direction) {
    if (shouldLoop(direction)) {
      var loopDistance = contentSize * (-1 * direction);
      vectors.forEach(function (v) {
        return v.add(loopDistance);
      });
    }
  }
  return { loop: loop };
}
function ScrollProgress(limit) {
  var max = limit.max,
    scrollLength = limit.length,
    self;
  function get(n) {
    var currentLocation;
    return (n - max) / -scrollLength;
  }
  return { get: get };
}
function ScrollSnap(axis, alignment, pxToPercent, containerRect, slideRects, slidesToScroll) {
  var startEdge = axis.startEdge,
    endEdge = axis.endEdge,
    snaps = measureUnaligned(),
    snapsAligned = measureAligned(),
    self;
  function measureSizes() {
    return arrayGroup(slideRects, slidesToScroll)
      .map(function (rects) {
        return arrayLast(rects)[endEdge] - rects[0][startEdge];
      })
      .map(pxToPercent.measure)
      .map(mathAbs);
  }
  function measureUnaligned() {
    return slideRects
      .map(function (rect) {
        return containerRect[startEdge] - rect[startEdge];
      })
      .map(pxToPercent.measure)
      .map(function (snap) {
        return -mathAbs(snap);
      });
  }
  function measureAligned() {
    var groupedSnaps = arrayGroup(snaps, slidesToScroll).map(function (g) {
        return g[0];
      }),
      alignments = measureSizes().map(alignment.measure);
    return groupedSnaps.map(function (snap, index) {
      return snap + alignments[index];
    });
  }
  return { snaps: snaps, snapsAligned: snapsAligned };
}
function ScrollTarget(loop, scrollSnaps, contentSize, limit, targetVector) {
  var reachedAny = limit.reachedAny,
    removeOffset = limit.removeOffset,
    constrain = limit.constrain,
    self;
  function minDistance(d1, d2) {
    return mathAbs(d1) < mathAbs(d2) ? d1 : d2;
  }
  function findTargetSnap(target) {
    var distance = loop ? removeOffset(target) : constrain(target),
      ascDiffsToSnaps,
      index;
    return {
      index: scrollSnaps
        .map(function (scrollSnap) {
          return scrollSnap - distance;
        })
        .map(function (diffToSnap) {
          return shortcut(diffToSnap, 0);
        })
        .map(function (diff, i) {
          return { diff: diff, index: i };
        })
        .sort(function (d1, d2) {
          return mathAbs(d1.diff) - mathAbs(d2.diff);
        })[0].index,
      distance: distance
    };
  }
  function shortcut(target, direction) {
    var t1 = target,
      t2 = target + contentSize,
      t3 = target - contentSize,
      shortest;
    return loop
      ? direction
        ? mathAbs(minDistance(t1, 1 === direction ? t2 : t3)) * direction
        : minDistance(minDistance(t1, t2), t3)
      : t1;
  }
  function byIndex(index, direction) {
    var diffToSnap, distance;
    return { index: index, distance: shortcut(scrollSnaps[index] - targetVector.get(), direction) };
  }
  function byDistance(distance, snap) {
    var target = targetVector.get() + distance,
      _a = findTargetSnap(target),
      index = _a.index,
      targetSnapDistance = _a.distance,
      reachedBound = !loop && reachedAny(target),
      diffToSnap,
      snapDistance;
    return !snap || reachedBound
      ? { index: index, distance: distance }
      : { index: index, distance: distance + shortcut(scrollSnaps[index] - targetSnapDistance, 0) };
  }
  return { byDistance: byDistance, byIndex: byIndex, shortcut: shortcut };
}
function ScrollTo(animation, indexCurrent, indexPrevious, scrollTarget, targetVector, events) {
  function scrollTo(target) {
    var distanceDiff = target.distance,
      indexDiff = target.index !== indexCurrent.get();
    distanceDiff && (animation.start(), targetVector.add(distanceDiff)),
      indexDiff && (indexPrevious.set(indexCurrent.get()), indexCurrent.set(target.index), events.emit("select"));
  }
  function distance(n, snap) {
    var target;
    scrollTo(scrollTarget.byDistance(n, snap));
  }
  function index(n, direction) {
    var targetIndex = indexCurrent.clone().set(n),
      target;
    scrollTo(scrollTarget.byIndex(targetIndex.get(), direction));
  }
  var self;
  return { distance: distance, index: index };
}
function SlideLooper(
  axis,
  viewSize,
  contentSize,
  slideSizesWithGaps,
  scrollSnaps,
  slidesInView,
  scrollLocation,
  slides
) {
  var ascItems = arrayKeys(slideSizesWithGaps),
    descItems = arrayKeys(slideSizesWithGaps).reverse(),
    loopPoints = startPoints().concat(endPoints()),
    self;
  function removeSlideSizes(indexes, from) {
    return indexes.reduce(function (a, i) {
      return a - slideSizesWithGaps[i];
    }, from);
  }
  function slidesInGap(indexes, gap) {
    return indexes.reduce(function (a, i) {
      var remainingGap;
      return removeSlideSizes(a, gap) > 0 ? a.concat([i]) : a;
    }, []);
  }
  function findLoopPoints(indexes, edge) {
    var isStartEdge = "start" === edge,
      offset = isStartEdge ? -contentSize : contentSize,
      slideBounds = slidesInView.findSlideBounds([offset]);
    return indexes.map(function (index) {
      var initial = isStartEdge ? 0 : -contentSize,
        altered = isStartEdge ? contentSize : 0,
        bounds,
        point = slideBounds.filter(function (b) {
          return b.index === index;
        })[0][isStartEdge ? "end" : "start"],
        getTarget;
      return {
        point: point,
        getTarget: function () {
          return scrollLocation.get() > point ? initial : altered;
        },
        index: index,
        location: -1
      };
    });
  }
  function startPoints() {
    var gap = scrollSnaps[0] - 1,
      indexes;
    return findLoopPoints(slidesInGap(descItems, gap), "end");
  }
  function endPoints() {
    var gap = viewSize - scrollSnaps[0] - 1,
      indexes;

    return findLoopPoints(slidesInGap(ascItems, gap), "start");
  }
  function canLoop() {
    return loopPoints.every(function (_a) {
      var index = _a.index,
        otherIndexes;
      return (
        removeSlideSizes(
          ascItems.filter(function (i) {
            return i !== index;
          }),
          viewSize
        ) <= 0
      );
    });
  }
  function loop() {
    loopPoints.forEach(function (loopPoint) {
      var getTarget = loopPoint.getTarget,
        location = loopPoint.location,
        index = loopPoint.index,
        target = getTarget();
      target !== location && ((slides[index].style[axis.startEdge] = target + "%"), (loopPoint.location = target));
    });
  }
  function clear() {
    loopPoints.forEach(function (_a) {
      var index = _a.index;
      slides[index].style[axis.startEdge] = "";
    });
  }
  return { canLoop: canLoop, clear: clear, loop: loop, loopPoints: loopPoints };
}
function SlidesInView(viewSize, contentSize, slideSizes, snaps, limit, loop, inViewThreshold) {
  var removeOffset = limit.removeOffset,
    constrain = limit.constrain,
    cachedThreshold = Math.min(Math.max(inViewThreshold, 0.01), 0.99),
    cachedOffsets = loop ? [0, contentSize, -contentSize] : [0],
    cachedBounds = findSlideBounds(cachedOffsets, cachedThreshold),
    self;
  function findSlideBounds(offsets, threshold) {
    var slideOffsets = offsets || cachedOffsets,
      slideThreshold = threshold || 0,
      thresholds = slideSizes.map(function (s) {
        return s * slideThreshold;
      });
    return slideOffsets.reduce(function (list, offset) {
      var bounds = snaps.map(function (snap, index) {
        return {
          start: snap - slideSizes[index] + thresholds[index] + offset,
          end: snap + viewSize - thresholds[index] + offset,
          index: index
        };
      });
      return list.concat(bounds);
    }, []);
  }
  function check(location, bounds) {
    var limitedLocation = loop ? removeOffset(location) : constrain(location),
      slideBounds;
    return (bounds || cachedBounds).reduce(function (list, slideBound) {
      var index = slideBound.index,
        start = slideBound.start,
        end = slideBound.end,
        inList,
        inView;
      return !(-1 !== list.indexOf(index)) && start < limitedLocation && end > limitedLocation
        ? list.concat([index])
        : list;
    }, []);
  }
  return { check: check, findSlideBounds: findSlideBounds };
}
function SlideSizes(axis, pxToPercent, slides, slideRects, loop) {
  var measureSize = axis.measureSize,
    startEdge = axis.startEdge,
    endEdge = axis.endEdge,
    sizesInPx = slideRects.map(measureSize),
    slideSizes,
    slideSizesWithGaps,
    self;
  function measureWithGaps() {
    return slideRects
      .map(function (rect, index, rects) {
        var isLast = index === arrayLastIndex(rects),
          style = window.getComputedStyle(arrayLast(slides)),
          endGap = parseFloat(style.getPropertyValue("margin-" + endEdge));
        return isLast ? sizesInPx[index] + (loop ? endGap : 0) : rects[index + 1][startEdge] - rect[startEdge];
      })
      .map(pxToPercent.measure)
      .map(mathAbs);
  }
  return { slideSizes: sizesInPx.map(pxToPercent.measure), slideSizesWithGaps: measureWithGaps() };
}
function Translate(axis, direction, container) {
  var translate = "x" === axis.scroll ? x : y,
    containerStyle = container.style,
    disabled = !1,
    self;
  function x(n) {
    return "translate3d(" + n + "%,0px,0px)";
  }
  function y(n) {
    return "translate3d(0px," + n + "%,0px)";
  }
  function to(target) {
    disabled || (containerStyle.transform = translate(direction.apply(target.get())));
  }
  function toggleActive(active) {
    disabled = !active;
  }
  function clear() {
    containerStyle.transform = "";
  }
  return { clear: clear, to: to, toggleActive: toggleActive };
}
function Engine(root, container, slides, options, events) {
  var align = options.align,
    scrollAxis = options.axis,
    contentDirection = options.direction,
    startIndex = options.startIndex,
    inViewThreshold = options.inViewThreshold,
    loop = options.loop,
    speed = options.speed,
    dragFree = options.dragFree,
    slidesToScroll = options.slidesToScroll,
    skipSnaps = options.skipSnaps,
    containScroll = options.containScroll,
    containerRect = container.getBoundingClientRect(),
    slideRects = slides.map(function (slide) {
      return slide.getBoundingClientRect();
    }),
    direction = Direction(contentDirection),
    axis = Axis(scrollAxis, contentDirection),
    pxToPercent = PxToPercent(axis.measureSize(containerRect)),
    viewSize = pxToPercent.totalPercent,
    alignment = Alignment(align, viewSize),
    _a = SlideSizes(axis, pxToPercent, slides, slideRects, loop),
    slideSizes = _a.slideSizes,
    slideSizesWithGaps = _a.slideSizesWithGaps,
    _b = ScrollSnap(axis, alignment, pxToPercent, containerRect, slideRects, slidesToScroll),
    snaps = _b.snaps,
    snapsAligned = _b.snapsAligned,
    contentSize = -arrayLast(snaps) + arrayLast(slideSizesWithGaps),
    snapsContained = ScrollContain(viewSize, contentSize, snaps, snapsAligned, containScroll).snapsContained,
    contain,
    scrollSnaps = !loop && "" !== containScroll ? snapsContained : snapsAligned,
    limit = ScrollLimit(contentSize, scrollSnaps, loop).limit,
    index = Counter(arrayLastIndex(scrollSnaps), startIndex, loop),
    indexPrevious = index.clone(),
    slideIndexes = arrayKeys(slides),
    update,
    animation = Animation(function () {
      loop || engine.scrollBounds.constrain(engine.dragHandler.pointerDown()), engine.scrollBody.seek(target).update();
      var settled = engine.scrollBody.settle(target);
      settled && !engine.dragHandler.pointerDown() && (engine.animation.stop(), events.emit("settle")),
        settled || events.emit("scroll"),
        loop && (engine.scrollLooper.loop(engine.scrollBody.direction()), engine.slideLooper.loop()),
        engine.translate.to(location),
        engine.animation.proceed();
    }),
    startLocation = scrollSnaps[index.get()],
    location = Vector1D(startLocation),
    target = Vector1D(startLocation),
    scrollBody = ScrollBody(location, speed, 1),
    scrollTarget = ScrollTarget(loop, scrollSnaps, contentSize, limit, target),
    scrollTo = ScrollTo(animation, index, indexPrevious, scrollTarget, target, events),
    slidesInView = SlidesInView(viewSize, contentSize, slideSizes, snaps, limit, loop, inViewThreshold),
    dragHandler,
    engine = {
      containerRect: containerRect,
      slideRects: slideRects,
      animation: animation,
      axis: axis,
      direction: direction,
      dragHandler: DragHandler(
        axis,
        direction,
        root,
        target,
        dragFree,
        DragTracker(axis, pxToPercent),
        location,
        animation,
        scrollTo,
        scrollBody,
        scrollTarget,
        index,
        events,
        loop,
        skipSnaps
      ),
      eventStore: EventStore(),
      pxToPercent: pxToPercent,
      index: index,
      indexPrevious: indexPrevious,
      limit: limit,
      location: location,
      options: options,
      scrollBody: scrollBody,
      scrollBounds: ScrollBounds(limit, location, target, scrollBody),
      scrollLooper: ScrollLooper(contentSize, pxToPercent, limit, location, [location, target]),
      scrollProgress: ScrollProgress(limit),
      scrollSnaps: scrollSnaps,
      scrollTarget: scrollTarget,
      scrollTo: scrollTo,
      slideLooper: SlideLooper(
        axis,
        viewSize,
        contentSize,
        slideSizesWithGaps,
        scrollSnaps,
        slidesInView,
        location,
        slides
      ),
      slidesInView: slidesInView,
      slideIndexes: slideIndexes,
      target: target,
      translate: Translate(axis, direction, container)
    };
  return engine;
}
function EventEmitter() {
  var listeners = {};
  function getListeners(evt) {
    return listeners[evt] || [];
  }
  function emit(evt) {
    return (
      getListeners(evt).forEach(function (e) {
        return e(evt);
      }),
      self
    );
  }
  function on(evt, cb) {
    return (listeners[evt] = getListeners(evt).concat([cb])), self;
  }
  function off(evt, cb) {
    return (
      (listeners[evt] = getListeners(evt).filter(function (e) {
        return e !== cb;
      })),
      self
    );
  }
  var self = { emit: emit, off: off, on: on };
  return self;
}
var defaultOptions = {
  align: "center",
  axis: "x",
  containScroll: "",
  direction: "ltr",
  dragFree: !1,
  draggable: !0,
  inViewThreshold: 0,
  loop: !1,
  skipSnaps: !1,
  slidesToScroll: 1,
  speed: 10,
  startIndex: 0
};
function OptionsPseudo(node) {
  var pseudoString = getComputedStyle(node, ":before").content,
    self;
  function get() {
    try {
      return JSON.parse(pseudoString.slice(1, -1).replace(/\\/g, ""));
    } catch (error) {}
    return {};
  }
  return { get: get };
}
function EmblaCarousel(nodes, userOptions, userPlugins) {
  var events = EventEmitter(),
    debouncedResize = debounce(resize, 500),
    reInit = reActivate,
    on = events.on,
    off = events.off,
    engine,
    activated = !1,
    optionsBase = Object.assign({}, defaultOptions, EmblaCarousel.globalOptions),
    options = Object.assign({}, optionsBase),
    optionsPseudo,
    plugins,
    rootSize = 0,
    root,
    container,
    slides;
  function setupElements() {
    var providedContainer = "container" in nodes && nodes.container,
      providedSlides = "slides" in nodes && nodes.slides;
    (root = "root" in nodes ? nodes.root : nodes),
      (container = providedContainer || root.children[0]),
      (slides = providedSlides || [].slice.call(container.children)),
      (optionsPseudo = OptionsPseudo(root));
  }
  function activate(withOptions, withPlugins) {
    if (
      (setupElements(),
      (optionsBase = Object.assign({}, optionsBase, withOptions)),
      (options = Object.assign({}, optionsBase, optionsPseudo.get())),
      (plugins = Object.assign([], withPlugins)),
      (engine = Engine(root, container, slides, options, events)).eventStore.add(window, "resize", debouncedResize),
      engine.translate.to(engine.location),
      (rootSize = engine.axis.measureSize(root.getBoundingClientRect())),
      plugins.forEach(function (plugin) {
        return plugin.init(self);
      }),
      options.loop)
    ) {
      if (!engine.slideLooper.canLoop()) return deActivate(), activate({ loop: !1 }, withPlugins);
      engine.slideLooper.loop();
    }
    options.draggable && container.offsetParent && slides.length && engine.dragHandler.addActivationEvents(),
      activated ||
        (setTimeout(function () {
          return events.emit("init");
        }, 0),
        (activated = !0));
  }
  function reActivate(withOptions, withPlugins) {
    if (activated) {
      var startIndex = selectedScrollSnap(),
        newOptions = Object.assign({ startIndex: startIndex }, withOptions);
      deActivate(), activate(newOptions, withPlugins || plugins), events.emit("reInit");
    }
  }
  function deActivate() {
    engine.dragHandler.removeAllEvents(),
      engine.animation.stop(),
      engine.eventStore.removeAll(),
      engine.translate.clear(),
      engine.slideLooper.clear(),
      plugins.forEach(function (plugin) {
        return plugin.destroy();
      });
  }
  function destroy() {
    activated && (deActivate(), (activated = !1), events.emit("destroy"));
  }
  function resize() {
    if (activated) {
      var size = engine.axis.measureSize(root.getBoundingClientRect());
      rootSize !== size && reActivate(), events.emit("resize");
    }
  }
  function slidesInView(target) {
    var location = engine[target ? "target" : "location"].get(),
      type = options.loop ? "removeOffset" : "constrain";
    return engine.slidesInView.check(engine.limit[type](location));
  }
  function slidesNotInView(target) {
    var inView = slidesInView(target);
    return engine.slideIndexes.filter(function (index) {
      return -1 === inView.indexOf(index);
    });
  }
  function scrollTo(index, jump, direction) {
    engine.scrollBody.useBaseMass().useSpeed(jump ? 100 : options.speed),
      activated && engine.scrollTo.index(index, direction || 0);
  }
  function scrollNext(jump) {
    var next;
    scrollTo(engine.index.clone().add(1).get(), !0 === jump, -1);
  }
  function scrollPrev(jump) {
    var prev;
    scrollTo(engine.index.clone().add(-1).get(), !0 === jump, 1);
  }
  function canScrollNext() {
    var next;
    return engine.index.clone().add(1).get() !== selectedScrollSnap();
  }
  function canScrollPrev() {
    var prev;
    return engine.index.clone().add(-1).get() !== selectedScrollSnap();
  }
  function scrollSnapList() {
    return engine.scrollSnaps.map(engine.scrollProgress.get);
  }
  function scrollProgress() {
    return engine.scrollProgress.get(engine.location.get());
  }
  function selectedScrollSnap() {
    return engine.index.get();
  }
  function previousScrollSnap() {
    return engine.indexPrevious.get();
  }
  function clickAllowed() {
    return engine.dragHandler.clickAllowed();
  }
  function internalEngine() {
    return engine;
  }
  function rootNode() {
    return root;
  }
  function containerNode() {
    return container;
  }
  function slideNodes() {
    return slides;
  }
  var self = {
    canScrollNext,
    canScrollPrev,
    clickAllowed,
    containerNode,
    internalEngine,
    destroy,
    off,
    on,
    previousScrollSnap,
    reInit,
    rootNode,
    scrollNext,
    scrollPrev,
    scrollProgress,
    scrollSnapList,
    scrollTo,
    selectedScrollSnap,
    slideNodes,
    slidesInView,
    slidesNotInView
  };
  return activate(userOptions, userPlugins), self;
}

customElements.define("carousel-container", class CC extends H {});
customElements.define("carousel-panel", class CP extends H {});
customElements.define("carousel-next", class CNE extends H {});
customElements.define("carousel-prev", class CPR extends H {});
customElements.define("carousel-dots", class CDS extends H {});
customElements.define("carousel-dot", class CD extends H {});
customElements.define("carousel-progress", class CP extends H {});

const setupDotBtns = (dotsArray, embla) =>
  dotsArray.forEach((dotNode, i) => dotNode.addEventListener("click", () => embla.scrollTo(i), false));

const generateDotBtns = (carousel, embla) => {
  const dots = carousel.querySelector("carousel-dots");
  if (!dots) return;
  const dot = dots.querySelector("carousel-dot");
  dots.querySelectorAll("carousel-dot").forEach((dot) => dot.remove());
  const selected = embla.selectedScrollSnap();
  embla.scrollSnapList().forEach((d, i) => {
    const newDot = dot.cloneNode(true);
    newDot.setAttribute("aria-selected", i === selected ? "true" : "false");
    dots.appendChild(newDot);
  });
  return Array.from(carousel.querySelectorAll("carousel-dot"));
};

const selectDotBtn = (dotsArray, embla) => () => {
  const previous = embla.previousScrollSnap();
  const selected = embla.selectedScrollSnap();
  dotsArray[previous].setAttribute("aria-selected", "false");
  dotsArray[selected].setAttribute("aria-selected", "true");
};

customElements.define(
  "checkout-carousel",
  class Carousel extends HTMLElement {
    propsDefinition = [
      ["axis", "string"],
      ["align", "string"],
      ["direction", "string"],
      ["draggable", "boolean"],
      ["dragFree", "boolean"],
      ["loop", "boolean"],
      ["speed", "number"],
      ["startIndex", "number"],
      ["skipSnaps", "boolean"]
    ];
    connectedCallback() {
      const carousel = this;
      const observerContainer = new MutationObserver(() => {
        if (carousel.querySelector('carousel-panel[data-template="true"]')) {
          carousel.init();
          observerContainer.disconnect();
        }
      });
      observerContainer.observe(this, { childList: true });
    }

    parseResponsiveProp = (attribute) => {
      const value = this.getAttribute(attribute);
      const toNumber = Number(value);
      if (isNaN(toNumber)) {
        const responsiveProps = eval(`({${value.split(" ").join(",")}})`);
        const sizes = {
          "2xl": 1536,
          xl: 1280,
          lg: 1024,
          md: 768,
          sm: 640
        };
        const applicablesSizes = Object.entries(sizes).reduce((acc, [size, breakpoint]) => {
          if (breakpoint <= window.innerWidth) {
            acc.push(size);
          }
          return acc;
        }, []);
        const parsedValue = responsiveProps[applicablesSizes.find((size) => responsiveProps[size])];
        if (!parsedValue) return Object.values(responsiveProps)[0];
        return parsedValue;
      }
      return toNumber;
    };
    buildPanels = () => {
      const slidesToShow = this.parseResponsiveProp("slidesToShow") || "xs:1 sm:2 lg:3 xl:4";
      const panels = this.querySelectorAll("carousel-panel");
      console.log(panels);
      panels.forEach((panel) => {
        const width = (100 / slidesToShow).toFixed(1);
        panel.style.flex = `0 0 ${width}%`;
        panel.style.minWidth = `${width}%`;
        panel.style.position = `relative`;
      });
    };
    handleDots = () => {
      const dotsArray = generateDotBtns(this, this.embla);
      if (dotsArray) {
        if (this.setSelectedDotBtn) {
          this.embla.off("select", this.setSelectedDotBtn);
          this.embla.off("init", this.setSelectedDotBtn);
        }
        this.setSelectedDotBtn = selectDotBtn(dotsArray, this.embla);
        setupDotBtns(dotsArray, this.embla);
        this.embla.on("select", this.setSelectedDotBtn);
        this.embla.on("init", this.setSelectedDotBtn);
      }
    };

    disablePrevNext = () => {
      if (this.embla.canScrollPrev()) this.prev.removeAttribute("disabled");
      else this.prev.setAttribute("disabled", "true");

      if (this.embla.canScrollNext()) this.next.removeAttribute("disabled");
      else this.next.setAttribute("disabled", "true");
    };
    handleArrows = () => {
      if (!this.props.loop && this.next && this.prev) {
        this.embla.on("init", this.disablePrevNext);
        this.embla.on("select", this.disablePrevNext);
      }
    };
    updateProgress = () => {
      if (this.progressContent) {
        this.progressContent.style.width = `${Math.max(0, Math.min(1, this.embla.scrollProgress())) * 100}%`;
      }
    };
    handleProgress = () => {
      const progressBar = this.querySelector("carousel-progress");
      if (!progressBar) return;
      this.progressContent = progressBar.querySelector("div");
      if (!this.progressContent) {
        this.progressContent = document.createElement("div");
        progressBar.appendChild(this.progressContent);
      }

      this.updateProgress();
      this.embla.on("scroll", this.updateProgress);
    };

    fetchCollection = async () => {
      const data = await (
        await fetch("https://somatoline-cosmetic.myshopify.com/api/2022-07/graphql.json", {
          headers: {
            accept: "*/*",
            "content-type": "application/graphql",
            "X-Shopify-Storefront-Access-Token": "c0c04b891c6f5ee006d938da53aabbee"
          },
          body: /* GraphQL */ `
            query {
              collection(handle: "[COLLECTION]") {
                title
                products(first: 20) {
                  edges {
                    node {
                      title
                      featuredImage {
                        altText
                        transformedSrc
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            id
                            priceV2 {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `.replace("[COLLECTION]", this.dataset.collection),
          method: "POST"
        })
      ).json();
      return data;
    };
    init = () => {
      this.props = getProps(this);
      const container = this.querySelector("carousel-container");

      this.template = this.querySelector('[data-template="true"]').cloneNode(true);

      this.querySelector('[data-template="true"]').remove();

      this.buildPanels();
      setTimeout(() => {
        this.embla = EmblaCarousel(container, {
          align: "start",
          loop: false,
          skipSnaps: true,
          containScroll: "trimSnaps",
          ...this.props
        });
        this.next = document.querySelector("carousel-next");
        this.prev = this.querySelector("carousel-prev");
        this.next && this.next.addEventListener("click", this.embla.scrollNext);
        this.prev && this.prev.addEventListener("click", this.embla.scrollPrev);

        this.handleProgress();
        this.handleDots();
        this.next && this.prev && this.handleArrows();
        // ARROWS

        window.addEventListener(
          "resize",
          () =>
            throttle.bind(this)(() => {
              this.buildPanels();
              this.embla.reInit();
              this.disablePrevNext();
              this.updateProgress();
              this.handleDots();
            }, 200),
          { passive: true }
        );
      }, 300);

      this.fetchCollection().then(
        ({
          data: {
            collection: {
              products: { edges: products }
            }
          }
        }) => {
          const loadedProducts = {};

          const appendProducts = () => {
            const loadedProductArray = Object.values(loadedProducts);
            if (loadedProductArray.some((p) => p === false)) {
              return;
            }
            loadedProductArray.forEach((productSlide) => {
              this.querySelector("carousel-content").append(productSlide);

              this.querySelectorAll("carousel-panel:not([data-template])").forEach((placeholder) => {
                placeholder.remove();
              });
              this.buildPanels();
            });
          };

          products.forEach(({ node: product }, i, array) => {
            const productSlide = this.template.cloneNode(true);

            productSlide.querySelector("h4").textContent = product.title;
            const img = productSlide.querySelector("img");
            img.src = product.featuredImage.transformedSrc;
            img.alt = product.featuredImage.altText;
            const [
              {
                node: { priceV2, id }
              }
            ] = product.variants.edges;
            productSlide
              .querySelector("checkout-carousel-product-form")
              .setAttribute("data-variant", id.replace("gid://shopify/ProductVariant/", ""));
            const formattedPrice = new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR"
            }).format(priceV2.amount);
            productSlide.querySelector(
              "checkout-carousel-product-form button"
            ).textContent = `Ajouter ${formattedPrice}`;

            productSlide.querySelector("button").addEventListener("click", async (e) => {
              e.preventDefault();
              console.log("hello");

              const res = await fetch("/cart/add.js", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
                },
                body: JSON.stringify({
                  items: [
                    {
                      id: Number(id.replace("gid://shopify/ProductVariant/", "")),
                      quantity: 1
                    }
                  ]
                })
              });
              console.log(await res.json());
              window.location.reload();
            });
            img.onload = () => {
              loadedProducts[product.title] = productSlide;
              appendProducts();
            };
            loadedProducts[product.title] = false;
          });
        }
      );
    }; 
  }
);
