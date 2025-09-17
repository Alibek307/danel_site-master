#!/usr/bin/env node

/**
 * Main script to generate all SEO files
 * Generates both sitemap.xml and robots.txt from site configuration
 */
import { writeSitemap } from './generate-sitemap';

async function generateAllSEOFiles() {
  console.log('🚀 Starting SEO files generation...\n');

  try {
    // Generate sitemap.xml
    console.log('📋 Generating sitemap.xml...');
    writeSitemap();
    console.log('');

    console.log('🎉 All SEO files generated successfully!');
    console.log('');
    console.log('📁 Generated files:');
    console.log('   • public/sitemap.xml');
    console.log('');
    console.log("💡 Don't forget to commit the updated files!");
  } catch (error: any) {
    console.error('❌ Error generating SEO files:', error.message);
    process.exit(1);
  }
}

// Run the script
generateAllSEOFiles();
