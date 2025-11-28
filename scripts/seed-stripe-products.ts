import { getUncachableStripeClient } from '../server/stripeClient';

interface PriceTier {
  credits: number;
  clipsPerDay: number;
  monthlyPrice: number;
  annualPrice: number;
}

async function createProducts() {
  const stripe = await getUncachableStripeClient();

  console.log('Creating NovarelStudio subscription products in Stripe...');

  const existingProducts = await stripe.products.search({ 
    query: "metadata['app']:'novarelstudio'" 
  });
  
  if (existingProducts.data.length > 0) {
    console.log('Products already exist. Skipping creation.');
    console.log('Existing products:', existingProducts.data.map(p => p.name).join(', '));
    return;
  }

  const creatorTiers: PriceTier[] = [
    { credits: 60, clipsPerDay: 2, monthlyPrice: 35, annualPrice: 23 },
    { credits: 120, clipsPerDay: 4, monthlyPrice: 55, annualPrice: 36 },
    { credits: 200, clipsPerDay: 7, monthlyPrice: 75, annualPrice: 49 },
    { credits: 300, clipsPerDay: 10, monthlyPrice: 95, annualPrice: 62 },
  ];

  const studioTiers: PriceTier[] = [
    { credits: 150, clipsPerDay: 5, monthlyPrice: 100, annualPrice: 65 },
    { credits: 250, clipsPerDay: 8, monthlyPrice: 150, annualPrice: 98 },
    { credits: 350, clipsPerDay: 12, monthlyPrice: 200, annualPrice: 130 },
    { credits: 450, clipsPerDay: 15, monthlyPrice: 275, annualPrice: 179 },
  ];

  const creatorProduct = await stripe.products.create({
    name: 'NovarelStudio Creator',
    description: 'For channels that treat streaming like a job. Includes 4K exports, advanced detection, Instagram auto-posting, and unlimited clip archive.',
    metadata: {
      app: 'novarelstudio',
      plan: 'creator',
      features: 'advanced_detection,instagram_autopost,branding_presets,email_support',
    },
  });

  console.log('Created Creator product:', creatorProduct.id);

  for (let tierIndex = 0; tierIndex < creatorTiers.length; tierIndex++) {
    const tier = creatorTiers[tierIndex];
    
    const monthlyPrice = await stripe.prices.create({
      product: creatorProduct.id,
      unit_amount: tier.monthlyPrice * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'creator',
        tier: tierIndex.toString(),
        credits: tier.credits.toString(),
        billing: 'monthly',
      },
    });

    const annualPrice = await stripe.prices.create({
      product: creatorProduct.id,
      unit_amount: tier.annualPrice * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'creator',
        tier: tierIndex.toString(),
        credits: tier.credits.toString(),
        billing: 'annual',
      },
    });

    console.log(`  Creator Tier ${tierIndex}: ${tier.credits} clips/mo`);
    console.log(`    Monthly: $${tier.monthlyPrice}/mo (${monthlyPrice.id})`);
    console.log(`    Annual: $${tier.annualPrice}/mo (${annualPrice.id})`);
  }

  const studioProduct = await stripe.products.create({
    name: 'NovarelStudio Studio',
    description: 'For partnered channels and small teams. Everything in Creator plus multi-channel workspaces, team access, API + webhooks, and priority support.',
    metadata: {
      app: 'novarelstudio',
      plan: 'studio',
      features: 'all_creator_features,multi_channel,team_access,api_webhooks,custom_templates,priority_support',
    },
  });

  console.log('Created Studio product:', studioProduct.id);

  for (let tierIndex = 0; tierIndex < studioTiers.length; tierIndex++) {
    const tier = studioTiers[tierIndex];
    
    const monthlyPrice = await stripe.prices.create({
      product: studioProduct.id,
      unit_amount: tier.monthlyPrice * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'studio',
        tier: tierIndex.toString(),
        credits: tier.credits.toString(),
        billing: 'monthly',
      },
    });

    const annualPrice = await stripe.prices.create({
      product: studioProduct.id,
      unit_amount: tier.annualPrice * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'studio',
        tier: tierIndex.toString(),
        credits: tier.credits.toString(),
        billing: 'annual',
      },
    });

    console.log(`  Studio Tier ${tierIndex}: ${tier.credits} clips/mo`);
    console.log(`    Monthly: $${tier.monthlyPrice}/mo (${monthlyPrice.id})`);
    console.log(`    Annual: $${tier.annualPrice}/mo (${annualPrice.id})`);
  }

  console.log('\nAll products and prices created successfully!');
  console.log('Run syncBackfill() to sync these to your database.');
}

createProducts().catch(console.error);
