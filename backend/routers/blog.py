from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime, timezone
import uuid

from models import BlogPostCreate, CommentCreate
from database import db

router = APIRouter()


@router.get("/blog")
async def get_blog_posts(include_drafts: Optional[bool] = False):
    """Get all blog posts"""
    query = {} if include_drafts else {"is_published": True}
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return posts


@router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    """Get single blog post by slug"""
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.post("/blog")
async def create_blog_post(post: BlogPostCreate):
    """Create a new blog post"""
    existing = await db.blog_posts.find_one({"slug": post.slug})
    if existing:
        raise HTTPException(status_code=400, detail="A blog post with this slug already exists")
    post_data = post.model_dump()
    post_data["id"] = str(uuid.uuid4())
    post_data["created_at"] = datetime.now(timezone.utc).isoformat()
    post_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.blog_posts.insert_one(post_data)
    del post_data["_id"]
    return post_data


@router.put("/blog/{post_id}")
async def update_blog_post(post_id: str, post: BlogPostCreate):
    """Update a blog post"""
    update_data = post.model_dump()
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one(
        {"id": post_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}


@router.delete("/blog/{post_id}")
async def delete_blog_post(post_id: str):
    """Delete a blog post"""
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}


@router.post("/blog/seed")
async def seed_blog_posts():
    """Seed initial blog posts from original CosyCasa content"""
    count = await db.blog_posts.count_documents({})
    if count > 0:
        return {"message": f"Blog already has {count} posts, skipping seed"}

    posts = [
        {
            "id": str(uuid.uuid4()),
            "slug": "conciergerie-cosycasa-a-porto-vecchio",
            "title": "Conciergerie CosyCasa à Porto Vecchio",
            "excerpt": "Cosy Casa Conciergerie Porto Vecchio vous propose un accompagnement sur mesure pour simplifier la gestion de vos locations saisonnières.",
            "content": "<p><strong>Cosy Casa</strong> Conciergerie Porto Vecchio vous propose un accompagnement sur mesure pour simplifier la gestion de vos locations saisonnières. Confiez l'organisation logistique à une équipe experte pour garantir à vos voyageurs un séjour fluide, haut de gamme et mémorable. Profitez d'une gestion locative professionnelle, alliant tranquillité d'esprit et performance optimale.</p><h2>Pourquoi choisir Cosy Casa pour votre gestion locative à Porto Vecchio</h2><p>Faire appel à Cosy Casa Conciergerie Porto Vecchio, c'est choisir une conciergerie haut de gamme spécialisée dans la gestion locative de courte durée. Porto Vecchio, perle du sud de la Corse, séduit par ses plages paradisiaques comme Palombaggia et Santa Giulia, sa citadelle animée et son ambiance méditerranéenne mêlant traditions corses et dolce vita.</p><p>Grâce à notre accompagnement personnalisé, votre bien gagne en visibilité et en rentabilité, tout en valorisant les atouts exceptionnels de Porto Vecchio.</p><h2>Évaluation de votre projet</h2><p>Avant toute mise en gestion locative, nous réalisons une évaluation complète et stratégique de votre projet. Cela comprend une analyse approfondie du marché local à Porto Vecchio ainsi qu'une étude détaillée des caractéristiques de votre logement. À partir de cette base, nous élaborons une stratégie tarifaire sur mesure, ajustée pour maximiser la rentabilité de votre location saisonnière.</p><h2>Une équipe dynamique et réactive</h2><p>Notre équipe est composée de professionnels passionnés par l'hospitalité et la gestion locative. Nous prenons le temps de comprendre vos attentes afin de vous proposer des solutions adaptées, efficaces et personnalisées. Notre priorité est votre satisfaction.</p><h2>Un réseau de partenaires</h2><p>Cosy Casa travaille en collaboration avec un réseau local de partenaires de confiance à Porto Vecchio. Qu'il s'agisse du ménage, de la blanchisserie ou de la maintenance, nous sélectionnons avec soin des prestataires fiables, expérimentés et soucieux de la qualité.</p><h2>Nos avantages</h2><p><strong>Gain de temps et d'argent</strong> — Notre modèle repose sur une gestion locative performante et une optimisation constante de vos revenus.</p><p><strong>Service simplifié</strong> — Nous prenons en charge l'ensemble du processus : rédaction des annonces, gestion des réservations, communication avec les voyageurs, accueil sur place.</p><p><strong>Engagement et responsabilité</strong> — Nous nous engageons à maintenir votre bien dans un état irréprochable pour offrir aux voyageurs un service de qualité.</p>",
            "hero_image": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
            "author": "Cosycasa",
            "meta_title": "Conciergerie CosyCasa à Porto Vecchio - cosycasa",
            "meta_description": "Conciergerie CosyCasa à Porto Vecchio – Services haut de gamme pour propriétaires et voyageurs : gestion locative, accueil, ménage et assistance 7j/7.",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "conciergerie-cosy-casa-a-pinarello",
            "title": "Conciergerie Cosy Casa à Pinarello",
            "excerpt": "Cosy Casa Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens en courte durée.",
            "content": "<p><strong>Cosy Casa</strong> Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens en courte durée. Confiez l'organisation de vos locations saisonnières à une équipe expérimentée afin d'assurer à vos voyageurs un séjour fluide, haut de gamme et mémorable.</p><h2>Pourquoi choisir Cosy Casa à Pinarello</h2><p>Pinarello, petit joyau de la côte sud-est de la Corse, enchante par sa plage de sable fin bordée de pins et ses eaux turquoises. Ce cadre idyllique attire chaque année des voyageurs exigeants à la recherche d'authenticité et de sérénité.</p><p>Avec Cosy Casa, votre bien à Pinarello bénéficie d'une gestion optimisée alliant visibilité, rentabilité et satisfaction des voyageurs.</p>",
            "hero_image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
            "author": "Cosycasa",
            "meta_title": "Conciergerie Cosy Casa à Pinarello",
            "meta_description": "Conciergerie Cosy Casa Pinarello – Gestion locative premium en Corse du Sud. Accompagnement sur mesure pour propriétaires.",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "conciergerie-cosy-casa-a-corse",
            "title": "Conciergerie Cosy Casa en Corse",
            "excerpt": "Cosy Casa Conciergerie vous propose un accompagnement sur mesure pour la gestion locative de vos biens partout en Corse.",
            "content": "<p><strong>Cosy Casa</strong> Conciergerie vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée partout en Corse. Confiez l'organisation de votre location à une équipe expérimentée pour garantir à vos hôtes un séjour fluide et sans accroc.</p><h2>La Corse, destination d'exception</h2><p>L'Île de Beauté séduit par la diversité de ses paysages : plages paradisiaques, montagnes majestueuses, villages perchés et maquis embaumé. La Corse du Sud en particulier offre un cadre idéal pour la location saisonnière haut de gamme.</p><p>Cosy Casa met son expertise au service de votre bien pour en maximiser le potentiel locatif tout en offrant une expérience inoubliable à vos voyageurs.</p>",
            "hero_image": "https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=1200&q=80",
            "author": "Cosycasa",
            "meta_title": "Conciergerie Cosy Casa en Corse",
            "meta_description": "Conciergerie Cosy Casa en Corse – Gestion locative complète pour propriétaires. Services premium en Corse du Sud.",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "conciergerie-cosy-casa-a-lecci",
            "title": "Conciergerie Cosy Casa à Lecci",
            "excerpt": "Cosy Casa Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée.",
            "content": "<p><strong>Cosy Casa</strong> Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée. Confiez l'organisation de votre location à une équipe expérimentée pour garantir à vos hôtes un séjour fluide, agréable et sans accroc.</p><h2>Lecci, entre mer et maquis</h2><p>Lecci, commune voisine de Porto-Vecchio, offre un cadre de vie exceptionnel entre plages secrètes et collines boisées. Son authenticité et sa tranquillité en font une destination prisée des voyageurs en quête de nature préservée.</p><p>Avec Cosy Casa, bénéficiez d'un accompagnement complet pour transformer votre bien à Lecci en une location saisonnière performante et rentable.</p>",
            "hero_image": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
            "author": "Cosycasa",
            "meta_title": "Conciergerie Cosy Casa à Lecci",
            "meta_description": "Conciergerie Cosy Casa Lecci – Gestion locative premium en Corse du Sud. Services sur mesure pour propriétaires.",
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
    ]

    await db.blog_posts.insert_many(posts)
    return {"message": f"Seeded {len(posts)} blog posts"}


@router.get("/blog/{slug}/comments")
async def get_blog_comments(slug: str):
    """Get approved comments for a blog post"""
    comments = await db.blog_comments.find(
        {"post_slug": slug, "is_approved": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return comments


@router.post("/blog/{slug}/comments")
async def create_blog_comment(slug: str, comment: CommentCreate):
    """Submit a comment on a blog post"""
    post = await db.blog_posts.find_one({"slug": slug})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    comment_data = comment.model_dump()
    comment_data["id"] = str(uuid.uuid4())
    comment_data["post_slug"] = slug
    comment_data["is_approved"] = True  # Auto-approve for now
    comment_data["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.blog_comments.insert_one(comment_data)
    del comment_data["_id"]
    return comment_data
