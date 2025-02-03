import {defineField, defineType} from 'sanity'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'text', 
      title: 'Artist description'
    }),
    defineField({
      name: 'photo',
      type: 'image',
      title: 'Artist photo',
      options: {
        hotspot: true,
        
      },
    }),
  ],
})