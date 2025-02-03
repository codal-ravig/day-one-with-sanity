import {defineField, defineType} from 'sanity'
import {CalendarIcon, EditIcon, MasterDetailIcon} from '@sanity/icons'
import { DoorsOpenInput } from './components/DoorsOpenInput'
export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details' , icon: MasterDetailIcon , default: true},
    {name: 'editorial', title: 'Editorial' , icon: EditIcon},
  ],
  fieldsets: [
    {name: 'keyFields', title: 'Venue and artists', options: {columns: 2}},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
      readOnly: ({currentUser}) => {
        const isAdmin = currentUser?.roles.some((role) => {
          return role.name === 'administrator'
        })
    
        return !isAdmin
      },
      hidden: ({currentUser}) => {
        const isAdmin = currentUser?.roles.find((role) => role.name === 'administrator') || false
    
        return !isAdmin
      },
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      group: 'details',
      validation: Rule => Rule.required().error('Slug is required'),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      group: 'details',
      deprecated: {
        reason: 'Use the "Event format" field instead.'
      },
      options: {
        list: ['concert', 'festival', 'conference', 'other','in-person', 'virtual'],
        layout: 'dropdown',
        }
    }),    
    defineField({
      name: 'format',
      type: 'string',
      group: 'details',
      title: 'Event format',
      readOnly: true,
      options: {
        list: ['concert', 'festival', 'conference', 'other','in-person', 'virtual'],
        layout: 'dropdown',
        },
        validation: (rule) => rule.required(),  
    }),
    defineField({
      name: 'date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'doorsOpen',
      group: 'details',
      type: 'number',
      initialValue: 0,
      description: 'Time in minutes before the event starts',
      components:{
        input: DoorsOpenInput,
      }
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      group: 'details',
      to: [{type: 'venue'}],
      fieldset: 'keyFields',
      readOnly: ({document}) => document?.eventType === 'festival',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context?.document?.eventType === 'festival') {
            return 'no festival events can have a venue'
          }
    
          return true
        }),
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      group: 'details',
      to: [{type: 'artist'}],
      fieldset: 'keyFields',
    }),
    defineField({
      name: 'image',
      group: 'editorial',
      type: 'image',
    }),
    defineField({
      name: 'details',
      type: 'array',
      group: 'editorial',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tickets',
      group: 'details',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      artist: 'headline.name',
      date: 'date',
      image: 'image',
    },
    prepare({name, venue, artist, date, image}) {
      const nameFormatted = name || 'Untitled event'
      const dateFormatted = date
        ? new Date(date).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
        : 'No date'
  
      return {
        title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
        subtitle: venue ? `${dateFormatted} at ${venue}` : dateFormatted,
        media: image || CalendarIcon,
      }
    },
  },
})