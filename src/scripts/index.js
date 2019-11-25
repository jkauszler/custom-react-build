import '../styles/index.scss'

function createElement(type, props, ...children){
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object"
          ? child
          : createTextElement(child)
      )
    }
  }
}

function createTextElement(text)  {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createCom(fiber){
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)

  const isProperty = key => key !== "children"

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = finber.props[name]
    })
}

// In the render function we set nextUnitOfWork to the root of the fiber tree.

function render(element, container){
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  }
}

let nextUnitOfWork = null

function workLoop(deadline) {
  let shouldYield = false
  while (nextUnitOfWork && !shouldYield) {
    // when the browser is ready,it will call our workLoop and we’ll start
    // working on the root. performUnitOfWork()

    nextUnitOfWork = performUnitOfWork(
      nextUnitOfWork
    )
    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
  // Create a new node and append it to the dom.
  // Keep track of the dom node in the fiber.dom property.

  if (!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // For each child we create a new fiber.

  const elements = fiber.props.children
  let index = 0
  let prevSibling = null

  while (index < elements.length){
    const element = elements[index]

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    }

    // We add it to the fiber tree setting it either as a child or as a sibling,
    // depending on whether it’s the first child or not.

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }

  // Finally we search for the next unit of work. We first try with the child,
  // then with the sibling, then with the uncle, and so on.

  if (fiber.child){
    return fiber.child
  }

  let nextFiber = fiber

  while (nextFiber) {
    if (nectFiber.sibling){
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

const JReact = {
  createElement,
  render
}

/** @jsx JReact.createElement */

const element = (
  <div id="foo">
    <h1>Hello World</h1>
  </div>
)

const container = document.getElementById("root")

JReact.render(element, container)
