function getPrev(parent, child, docs) {
  const { subpages } = docs[parent]

  // If subpage
  if (child !== null) {
    // If not the last
    if (child > 0) {
      return subpages[child - 1]
    }
  }

  // Get previous page
  const prevParent = docs[parent - 1]

  // If subpages, return the last one
  if (prevParent.subpages) {
    return prevParent.subpages[prevParent.subpages.length - 1]
  }

  return prevParent
}

function getNext(parent, child, docs) {
  const { subpages } = docs[parent]

  if (child !== null || subpages) {
    if (subpages && child < subpages.length - 1) {
      return subpages[child + 1]
    }
  }

  const nextParent = docs[parent + 1]

  if (nextParent.subpages) {
    return nextParent.subpages[0]
  }

  return nextParent
}

// eslint-disable-next-line no-undef
hexo.extend.helper.register('getDocsNav', (url, docs) => {
  let prev = null
  let next = null
  let parent = null
  let child = null

  docs.forEach((doc, i) => {
    // If url match parent.path
    // OR no subpages AND match parent.url (=== single child)
    // it is parent level…
    if (doc.path === url || (!doc.subpages && doc.url === url)) {
      parent = i

      // Not de first parent
      if (i > 0) {
        prev = getPrev(parent, child, docs)
      }
      // Not the last parent
      // or parent with subpages
      if (parent < docs.length - 1 || (docs[parent] && docs[parent].subpages)) {
        next = getNext(parent, child, docs)
      }
    } else if (doc.subpages) {
      doc.subpages.forEach((sub, j) => {
        if (sub.url === url) {
          parent = i
          child = j

          // Not the first page OR first subpage
          if (child > 0 || parent > 0) {
            prev = getPrev(parent, child, docs)
          }

          // Not the last page OR subpage
          if (child < doc.subpages.length - 1 || parent < docs.length - 1) {
            next = getNext(parent, child, docs)
          }
        }
      })
    }
  })

  return [prev, next]
})

// slack invite link markdown helper
hexo.extend.tag.register('slack_invite', () => {
  return hexo.config.slack_invite;
});
