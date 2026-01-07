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
          'api::page.page.find',
          'api::page.page.findOne',
          'api::site-identity.site-identity.find',
          'api::site-identity.site-identity.findOne',
          'api::topic.topic.find',
          'api::topic.topic.findOne',
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
      // 2. Seed Home Hero if missing or unpublished
      const homeHero = await strapi.db.query('api::home-hero.home-hero').findOne({});
      const now = new Date();

      if (!homeHero) {
        log('Creating Home Hero via strapi.db with explicit timestamps...');
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
              publishedAt: now,
            },
          });
          log(`Created Home Hero via DB. ID: ${newHero.id}`);
        } catch (dbErr) {
          log(`DB Create Error: ${dbErr.message}`);
        }
      } else if (!homeHero.publishedAt) {
        log(`Found Home Hero (ID: ${homeHero.id}) but it is UNPUBLISHED. Publishing now...`);
        try {
          await strapi.db.query('api::home-hero.home-hero').update({
            where: { id: homeHero.id },
            data: {
              publishedAt: now,
            }
          });
          log('Reference to Home Hero published.');
        } catch (updateErr) {
          log(`DB Update Error: ${updateErr.message}`);
        }
      } else {
        log(`Home Hero exists and is published (ID: ${homeHero.id}).`);
      }

      // 3. Seed About Us Page if missing
      const aboutPage = await strapi.db.query('api::page.page').findOne({
        where: { slug: 'about-us' }
      });

      if (!aboutPage) {
        log('Creating About Us Page...');
        const now = new Date();
        await strapi.db.query('api::page.page').create({
          data: {
            title: 'About Khadimy',
            slug: 'about-us',
            content: '# About Us\n\nKhadimy is a platform dedicated to bridging the gap between academic theory and real-world industry practice.\n\n## Our Mission\n\nTo empower learners with practical skills that matter.',
            seo_title: 'About Us - Khadimy',
            seo_description: 'Learn more about Khadimy and our mission.',
            published_at: now,
            publishedAt: now,
          }
        });
        log('Created About Us Page.');
      }

      // 4. Seed Site Identity
      const siteIdentityCount = await strapi.db.query('api::site-identity.site-identity').count();
      if (siteIdentityCount === 0) {
        log('Creating default Site Identity...');
        const now = new Date();
        await strapi.db.query('api::site-identity.site-identity').create({
          data: {
            site_name: 'Khadimy',
            alt_text: 'Khadimy Logo',
            published_at: now,
            publishedAt: now,
          }
        });
        log('Created default Site Identity.');
      }

      // 5. Seed Topics
      const topicCount = await strapi.db.query('api::topic.topic').count();
      if (topicCount === 0) {
        log('Creating default Topics...');
        const topics = ['Social Media', 'Email Marketing', 'SEO', 'Inbound Sales', 'Content Marketing'];
        const now = new Date();
        for (const name of topics) {
          await strapi.db.query('api::topic.topic').create({
            data: {
              name,
              slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
              published_at: now,
              publishedAt: now,
            }
          });
        }
        log('Created default Topics.');
      }

      log('🚀 Bootstrap finish.');

    } catch (error) {
      log('❌ ERROR: ' + error.message);
      console.error(error);
    }
  },
};
