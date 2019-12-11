export function getOuterHtml(el){
  const fragment = document.createDocumentFragment()
  fragment.appendChild(el)
  console.log('fragment', fragment.innerHTML)
  return fragment.innerHTML
}