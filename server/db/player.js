import r from '../../db/connect'

export function getPlayerById(id, mergeChapter = false) {
  const player = r.table('players').get(id)
  return mergeChapter ?
    player
      .merge({chapter: r.table('chapters').get(r.row('chapterId'))})
      .without('chapterId') :
    player
}

export function reassignPlayersToChapter(playerIds, chapterId) {
  const now = r.now()

  return r.table('players')
    .getAll(...playerIds)
    .filter(r.row('chapterId').ne(chapterId))
    .update({
      chapterId,
      chapterHistory: r.row('chapterHistory').default([]).insertAt(0, {chapterId: r.row('chapterId'), until: now}),
      updatedAt: now,
    }, {returnChanges: 'always'})
    .run()
    .then(updatedPlayers => {
      if (updatedPlayers.errors) {
        return Promise.reject(updatedPlayers.first_error)
      }
      if (updatedPlayers.replaced > 0) {
        return updatedPlayers.changes.map(change => change.new_val)
      }
      return []
    })
}
