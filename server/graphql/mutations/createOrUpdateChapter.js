import {GraphQLNonNull} from 'graphql'

import {userCan} from 'src/common/util'
import {chapterSchema} from 'src/common/validations'
import {saveChapter} from 'src/server/db/chapter'
import {Chapter, InputChapter} from 'src/server/graphql/schemas'
import {LGNotAuthorizedError, LGInternalServerError} from 'src/server/util/error'

export default {
  type: Chapter,
  args: {
    chapter: {type: new GraphQLNonNull(InputChapter)},
  },
  async resolve(source, {chapter}, {rootValue: {currentUser}}) {
    if (chapter.id && !userCan(currentUser, 'updateChapter') || !chapter.id && !userCan(currentUser, 'createChapter')) {
      throw new LGNotAuthorizedError()
    }

    await chapterSchema.validate(chapter) // validation error will be thrown if invalid

    const result = await saveChapter(chapter, {returnChanges: true})
    if (result.replaced || result.inserted) {
      return result.changes[0].new_val
    }

    throw new LGInternalServerError('Could not save chapter, please try again')
  }
}
