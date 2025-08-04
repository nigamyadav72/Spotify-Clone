import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";

import {
    upsertProductRecord,
    upsertPriceRecord,
    manageSubscriptionStatusChange 
} from "@/libs/supabaseAdmin"


const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export async function POST(
    request: Request
) {
    console.log('=== WEBHOOK RECEIVED ===');
    const body = await request.text()
    console.log('Webhook body length:', body.length);
    const sig = request.headers.get('Stripe-Signature')
    console.log('Stripe signature present:', !!sig);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    console.log('Webhook secret configured:', !!webhookSecret);
    let event: Stripe.Event

    try {
        if(!sig || !webhookSecret) {
            console.error('Missing webhook signature or secret');
            console.error('Signature:', sig);
            console.error('Webhook secret configured:', !!webhookSecret);
            return NextResponse.json({ message: 'Missing webhook signature or secret' }, { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (error: any) {
        console.error(`Webhook error: ${error.message}`);
        return NextResponse.json({ message: 'Webhook error' }, { status: 400 });
    }
    
    console.log('Event type received:', event.type);
    console.log('Is relevant event:', relevantEvents.has(event.type));
    
    if (relevantEvents.has(event.type)) {
        try {
            console.log('Processing event:', event.type);
            switch (event.type) {
                case 'product.created':
                case 'product.updated':
                    await upsertProductRecord(event.data.object as Stripe.Product);
                    break;
                case 'price.created':
                case 'price.updated':
                    await upsertPriceRecord(event.data.object as Stripe.Price);
                    break;
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                case 'customer.subscription.deleted':
                    const subscription = event.data.object as Stripe.Subscription;
                    await manageSubscriptionStatusChange(
                        subscription.id,
                        subscription.customer as string,
                        event.type === 'customer.subscription.created'
                    );
                    break;
                case 'checkout.session.completed':
                    const checkoutSession = event.data.object as Stripe.Checkout.Session;
                    if (checkoutSession.mode === 'subscription') {
                        const subscriptionId = checkoutSession.subscription;
                        await manageSubscriptionStatusChange(
                            subscriptionId as string,
                            checkoutSession.customer as string,
                            true
                        );
                    }
                    break;
                default:
                    throw new Error('Unhandled relevant event!');
            }
        } catch (error: any) {
            console.error('Webhook handler failed:', error);
            console.error('Event type:', event.type);
            console.error('Event data:', JSON.stringify(event.data, null, 2));
            return NextResponse.json({ error: 'Webhook handler failed. View logs.' }, { status: 400 });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}