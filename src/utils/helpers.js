export function showTab(tabId, event, group) {
    const tabs = document.querySelectorAll(`.tabs[data-group="${group}"] .tab`)
    tabs.forEach((btn) => btn.classList.remove('active'))

    const lists = document.querySelectorAll(`.data-list[data-group="${group}"]`)
    lists.forEach((list) => (list.style.display = 'none'))

    event.currentTarget.classList.add('active')

    const tabContent = document.getElementById(tabId)
    if (tabContent) tabContent.style.display = 'block'
}