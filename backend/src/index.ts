// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const fs = require('fs');
    const path = require('path');
    const logPath = path.join(process.cwd(), 'bootstrap_debug.log');

    const log = (msg) => {
      const time = new Date().toISOString();
      try {
        fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
      } catch (e) {
        // ignore
      }
      console.log(`[BOOTSTRAP] ${msg}`);
    };

    try {
      log('🚀 Starting Bootstrap sequence (FS LOGGING) - ATTEMPT 4...');

      // 1. Setup Public Permissions
      // Use strapi.db to bypass document service logic and use raw IDs
      const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });

      if (publicRole) {
        log(`Found Public Role ID: ${publicRole.id}`);

        const actionsToEnable = [
          'api::home-hero.home-hero.find', // Single Type
          'api::course.course.find',
          'api::course.course.findOne',
          'api::article.article.find',
          'api::article.article.findOne',
          'api::expert.expert.find',
          'api::expert.expert.findOne',
          'api::partner.partner.find',
          'api::partner.partner.findOne',
          'api::event.event.find',
          'api::event.event.findOne',
        ];

        for (const action of actionsToEnable) {
          const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
            where: {
              action: action,
              role: publicRole.id,
            },
          });

          if (!existing) {
            log(`Creating permission for: ${action}`);
            await strapi.db.query('plugin::users-permissions.permission').create({
              data: {
                action,
                role: publicRole.id, // Use numeric ID for strapi.db
              },
            });
          }
        }
      } else {
        log('⚠️ Public role not found.');
      }

      // 2. Seed Home Hero if missing
      const homeHeroCount = await strapi.db.query('api::home-hero.home-hero').count();
      log(`Home Hero count BEFORE: ${homeHeroCount}`);

      if (homeHeroCount === 0) {
        log('Creating Home Hero via strapi.db with explicit timestamps...');
        const now = new Date();

        try {
          const newHero = await strapi.db.query('api::home-hero.home-hero').create({
            data: {
              cohort_text: '🚀 New Cohorts Starting January 2026',
              title_main: 'From knowledge to',
              title_highlight: 'Real-World Skills',
              description: 'Khadimy bridges the gap between academic theory and industry practice. Learn from experts, build real projects, and join a community of doers.',
              primary_button_text: 'View Courses',
              primary_button_link: '/courses',
              secondary_button_text: 'Join Community',
              secondary_button_link: '/community',
              badge_left_text: 'Industry Certified',
              badge_right_text: '500+ Students',
              background_style: 'globe_animation',
              // Set BOTH cases to be sure for raw DB query
              published_at: now,
              publishedAt: now,
              created_at: now,
              createdAt: now,
              updated_at: now,
              updatedAt: now,
            },
          });
          log(`Created Home Hero via DB. ID: ${newHero.id}`);
        } catch (dbErr) {
          log(`DB Create Error: ${dbErr.message}`);
        }

        const countAfter = await strapi.db.query('api::home-hero.home-hero').count();
        log(`Home Hero count AFTER: ${countAfter}`);
      }

      log('🚀 Bootstrap finish.');

    } catch (error) {
      log('❌ ERROR: ' + error.message);
      console.error(error);
    }
  },
};
