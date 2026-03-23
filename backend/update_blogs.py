import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "cosycasa")

UPDATES = {
    "conciergerie-cosy-casa-a-pinarello": {
        "title": "Conciergerie Cosy Casa à Pinarello",
        "excerpt": "Cosy Casa Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens en courte durée.",
        "meta_title": "Conciergerie Cosy Casa à Pinarello - cosycasa",
        "meta_description": "Conciergerie Cosy Casa Pinarello – Gestion locative haut de gamme en Corse du Sud. Accompagnement sur mesure pour propriétaires.",
        "content": """<p><strong>Cosy Casa</strong> Conciergerie Pinarello vous propose un accompagnement personnalisé pour simplifier la gestion locative de vos biens en courte durée. Confiez l'organisation de vos locations saisonnières à une équipe expérimentée afin d'assurer à vos voyageurs un séjour fluide, confortable et mémorable. Grâce à notre conciergerie haut de gamme, vous bénéficiez d'un service de qualité alliant sérénité, réactivité et performance locative optimale.</p>

<h2>Pourquoi choisir Cosy Casa pour votre gestion locative à Pinarello</h2>
<p>Faire confiance à Cosy Casa Conciergerie Pinarello, c'est opter pour une gestion locative haut de gamme pensée pour valoriser votre bien dans un cadre idyllique. Nichée sur la côte Est de la Corse, Pinarello séduit par ses plages de sable fin bordées de pins parasols, ses eaux cristallines propices à la détente et aux sports nautiques, ainsi que son atmosphère paisible typiquement méditerranéenne. Cette station balnéaire de charme attire une clientèle exigeante à la recherche d'authenticité et de confort.</p>
<p>Grâce à notre savoir-faire, votre bien bénéficie d'une visibilité optimale sur le marché locatif et d'un accompagnement sur mesure à chaque étape. De la gestion des réservations à l'accueil des voyageurs, en passant par l'entretien de votre logement, Cosy Casa vous propose un service de qualité alliant rigueur, efficacité et rentabilité.</p>

<h2>Évaluation de votre projet</h2>
<p>Avant toute mise en gestion, Cosy Casa réalise avec vous une analyse approfondie de votre bien à Pinarello. Nous étudions les caractéristiques du marché local, identifions les points forts de votre logement et mettons en place une stratégie tarifaire adaptée. Ce plan d'action est ajusté régulièrement afin d'assurer une gestion locative durable, performante et alignée avec vos objectifs.</p>

<h2>Une équipe dynamique et réactive</h2>
<p>Notre équipe est composée de professionnels passionnés par l'hospitalité et experts en gestion locative. À l'écoute de vos besoins, nous élaborons des solutions personnalisées pour valoriser votre bien et satisfaire pleinement vos attentes. Réactivité, disponibilité et souci du détail font de Cosy Casa un partenaire de confiance pour gérer efficacement votre propriété à Pinarello.</p>

<h2>Un réseau de partenaires</h2>
<p>Cosy Casa s'appuie sur un réseau local de prestataires triés sur le volet à Pinarello. Ménage soigné, blanchisserie de qualité, services de maintenance rapides et fiables : nous coordonnons l'ensemble des interventions pour vous garantir tranquillité d'esprit et excellence opérationnelle. Chaque partenaire est sélectionné pour son professionnalisme et sa capacité à répondre aux standards d'une conciergerie haut de gamme.</p>

<h2>Gage de qualité</h2>
<p>Avec plus de trois années d'expérience dans la conciergerie haut de gamme et la gestion de biens touristiques, Cosy Casa est aujourd'hui un acteur reconnu en Corse. Membre de réseaux professionnels exigeants et collaborateur de plateformes éthiques, nous mettons notre expertise au service des propriétaires indépendants à Pinarello pour une gestion locative transparente, responsable et rentable.</p>

<h2>Quelles sont nos avantages avec la conciergerie Pinarello ?</h2>

<h3>Gain de temps et d'argent</h3>
<p>Notre modèle économique repose sur la performance de votre location. C'est pourquoi toute l'équipe de Cosy Casa s'engage à maximiser vos revenus locatifs à Pinarello grâce à une gestion optimisée et une stratégie tarifaire dynamique. Vous économisez du temps tout en augmentant la rentabilité de votre bien avec un partenaire fiable et réactif.</p>

<h3>Service simplifié</h3>
<p>Avec Cosy Casa Conciergerie Pinarello, vous profitez d'un service complet, fluide et transparent. De la création des annonces à la gestion du calendrier en passant par l'accueil des voyageurs, nous nous occupons de tout. Vous restez informé à chaque étape, tout en étant libéré des contraintes de la location saisonnière.</p>

<h3>Engagement et responsabilité</h3>
<p>Nous veillons scrupuleusement à l'entretien et à la bonne tenue de votre logement grâce à des prestataires compétents et rigoureux. Du nettoyage à la maintenance, chaque tâche est assurée avec sérieux pour offrir à vos hôtes un hébergement irréprochable. Cosy Casa vous garantit un service de qualité, à la hauteur des attentes d'une clientèle exigeante et des standards d'une conciergerie haut de gamme à Pinarello.</p>"""
    },
    "conciergerie-cosy-casa-a-corse": {
        "title": "Conciergerie Cosy Casa à Corse",
        "excerpt": "Cosy Casa Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée.",
        "meta_title": "Conciergerie Cosy Casa en Corse - cosycasa",
        "meta_description": "Conciergerie Cosy Casa en Corse – Gestion locative haut de gamme. Services premium pour propriétaires en Corse du Sud.",
        "content": """<p><strong>Cosy Casa</strong> Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée. Confiez l'organisation de votre location à une équipe expérimentée pour garantir à vos hôtes un séjour fluide, agréable et sans accroc. Avec notre conciergerie haut de gamme, bénéficiez d'un service de qualité combinant sérénité et performance locative optimale.</p>

<h2>Pourquoi choisir Cosy Casa pour votre gestion locative à Corse</h2>
<p>Choisir Cosy Casa Conciergerie Lecci, c'est faire le choix d'un partenaire de confiance spécialisé dans la gestion locative premium. Située à proximité de Porto Vecchio, Lecci bénéficie d'un environnement exceptionnel : plages emblématiques comme Saint-Cyprien, criques aux eaux turquoise, sentiers de randonnée, et charme typique de la Corse-du-Sud. Porto Vecchio, tout proche, complète cette attractivité avec sa citadelle animée, ses restaurants de qualité, son port de plaisance et ses animations estivales.</p>
<p>Grâce à notre accompagnement personnalisé, votre bien tire pleinement parti de ce cadre enchanteur tout en maximisant sa rentabilité. De la gestion des réservations à l'accueil des voyageurs, notre équipe prend en charge chaque étape avec rigueur et réactivité. Avec Cosy Casa, vous bénéficiez d'un service de qualité qui valorise votre bien immobilier de manière optimale.</p>

<h2>Évaluation de votre projet</h2>
<p>Avant toute mise en location, nous réalisons une étude approfondie de votre bien à Lecci. Cette phase inclut une analyse détaillée du marché local ainsi qu'un diagnostic précis des atouts de votre logement. À partir de ces éléments, nous élaborons une stratégie tarifaire sur mesure, pensée pour booster la rentabilité. Cette stratégie est réévaluée régulièrement pour maintenir un bon niveau de performance dans le temps.</p>

<h2>Une équipe dynamique et réactive</h2>
<p>Cosy Casa s'appuie sur une équipe passionnée par l'hospitalité et experte en gestion locative. À l'écoute de vos attentes, nous mettons en place des solutions personnalisées avec pour objectif votre entière satisfaction. Notre réactivité, notre professionnalisme et notre sens du détail font de nous un partenaire fiable à Lecci pour piloter efficacement votre projet locatif.</p>

<h2>Un réseau de partenaires</h2>
<p>Cosy Casa collabore avec un réseau de partenaires locaux à Lecci soigneusement sélectionnés pour leur fiabilité et leur savoir-faire. Ménage, blanchisserie, maintenance : chaque prestataire est choisi pour la qualité de ses interventions. En assurant une coordination rigoureuse de ces services, nous vous garantissons un fonctionnement fluide et une gestion locative sans tracas.</p>

<h2>Gage de qualité</h2>
<p>Avec plusieurs années d'expérience dans la conciergerie haut de gamme et la gestion de biens touristiques, Cosy Casa est aujourd'hui un acteur reconnu du secteur. Nous sommes fiers de collaborer avec des plateformes éthiques et des réseaux professionnels afin de garantir à nos clients à Lecci un service de gestion locative de confiance, responsable et performant.</p>

<h2>Quelles sont nos avantages avec la conciergerie Cosy Casa ?</h2>

<h3>Gain de temps et d'argent</h3>
<p>Notre rémunération est directement liée aux performances de votre location. C'est pourquoi l'équipe Cosy Casa met tout en œuvre pour maximiser vos revenus locatifs à Lecci, en s'appuyant sur une stratégie tarifaire dynamique et une gestion optimisée. Vous gagnez du temps, augmentez votre rentabilité, et restez serein.</p>

<h3>Service simplifié</h3>
<p>Avec Cosy Casa Conciergerie Lecci, vous profitez d'un service fluide et tout-en-un. Création des annonces, gestion du calendrier, communication avec les voyageurs, accueil et suivi : nous gérons tout de A à Z. Vous êtes libéré des contraintes quotidiennes tout en gardant la main sur les grandes décisions.</p>

<h3>Engagement et responsabilité</h3>
<p>Nous veillons au bon état de votre logement grâce à des prestataires compétents et attentifs. Chaque mission – ménage, entretien, vérification – est réalisée avec soin pour offrir à vos hôtes un hébergement irréprochable. Cosy Casa vous garantit un service de qualité, à la hauteur des standards d'une conciergerie haut de gamme à Lecci.</p>"""
    },
    "conciergerie-cosy-casa-a-lecci": {
        "title": "Conciergerie Cosy Casa à Lecci",
        "excerpt": "Cosy Casa Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée.",
        "meta_title": "Conciergerie Cosy Casa à Lecci - cosycasa",
        "meta_description": "Conciergerie Cosy Casa Lecci – Gestion locative premium en Corse du Sud. Services sur mesure pour propriétaires.",
        "content": """<p><strong>Cosy Casa</strong> Conciergerie Lecci vous propose un accompagnement sur mesure pour la gestion locative de vos biens en courte durée. Confiez l'organisation de votre location à une équipe expérimentée pour garantir à vos hôtes un séjour fluide, agréable et sans accroc. Avec notre conciergerie haut de gamme, bénéficiez d'un service de qualité combinant sérénité et performance locative optimale.</p>

<h2>Pourquoi choisir Cosy Casa pour votre gestion locative à Lecci</h2>
<p>Choisir Cosy Casa Conciergerie Lecci, c'est faire le choix d'un partenaire de confiance spécialisé dans la gestion locative premium. Située à proximité de Porto Vecchio, Lecci bénéficie d'un environnement exceptionnel : plages emblématiques comme Saint-Cyprien, criques aux eaux turquoise, sentiers de randonnée, et charme typique de la Corse-du-Sud. Porto Vecchio, tout proche, complète cette attractivité avec sa citadelle animée, ses restaurants de qualité, son port de plaisance et ses animations estivales.</p>
<p>Grâce à notre accompagnement personnalisé, votre bien tire pleinement parti de ce cadre enchanteur tout en maximisant sa rentabilité. De la gestion des réservations à l'accueil des voyageurs, notre équipe prend en charge chaque étape avec rigueur et réactivité. Avec Cosy Casa, vous bénéficiez d'un service de qualité qui valorise votre bien immobilier de manière optimale.</p>

<h2>Évaluation de votre projet</h2>
<p>Avant toute mise en location, nous réalisons une étude approfondie de votre bien à Lecci. Cette phase inclut une analyse détaillée du marché local ainsi qu'un diagnostic précis des atouts de votre logement. À partir de ces éléments, nous élaborons une stratégie tarifaire sur mesure, pensée pour booster la rentabilité. Cette stratégie est réévaluée régulièrement pour maintenir un bon niveau de performance dans le temps.</p>

<h2>Une équipe dynamique et réactive</h2>
<p>Cosy Casa s'appuie sur une équipe passionnée par l'hospitalité et experte en gestion locative. À l'écoute de vos attentes, nous mettons en place des solutions personnalisées avec pour objectif votre entière satisfaction. Notre réactivité, notre professionnalisme et notre sens du détail font de nous un partenaire fiable à Lecci pour piloter efficacement votre projet locatif.</p>

<h2>Un réseau de partenaires</h2>
<p>Cosy Casa collabore avec un réseau de partenaires locaux à Lecci soigneusement sélectionnés pour leur fiabilité et leur savoir-faire. Ménage, blanchisserie, maintenance : chaque prestataire est choisi pour la qualité de ses interventions. En assurant une coordination rigoureuse de ces services, nous vous garantissons un fonctionnement fluide et une gestion locative sans tracas.</p>

<h2>Gage de qualité</h2>
<p>Avec plusieurs années d'expérience dans la conciergerie haut de gamme et la gestion de biens touristiques, Cosy Casa est aujourd'hui un acteur reconnu du secteur. Nous sommes fiers de collaborer avec des plateformes éthiques et des réseaux professionnels afin de garantir à nos clients à Lecci un service de gestion locative de confiance, responsable et performant.</p>

<h2>Quels sont nos avantages avec la conciergerie Cosy Casa ?</h2>

<h3>Gain de temps et d'argent</h3>
<p>Notre rémunération est directement liée aux performances de votre location. C'est pourquoi l'équipe Cosy Casa met tout en œuvre pour maximiser vos revenus locatifs à Lecci, en s'appuyant sur une stratégie tarifaire dynamique et une gestion optimisée. Vous gagnez du temps, augmentez votre rentabilité, et restez serein.</p>

<h3>Service simplifié</h3>
<p>Avec Cosy Casa Conciergerie Lecci, vous profitez d'un service fluide et tout-en-un. Création des annonces, gestion du calendrier, communication avec les voyageurs, accueil et suivi : nous gérons tout de A à Z. Vous êtes libéré des contraintes quotidiennes tout en gardant la main sur les grandes décisions.</p>

<h3>Engagement et responsabilité</h3>
<p>Nous veillons au bon état de votre logement grâce à des prestataires compétents et attentifs. Chaque mission – ménage, entretien, vérification – est réalisée avec soin pour offrir à vos hôtes un hébergement irréprochable. Cosy Casa vous garantit un service de qualité, à la hauteur des standards d'une conciergerie haut de gamme à Lecci.</p>"""
    },
    "conciergerie-cosycasa-a-porto-vecchio": {
        "title": "Conciergerie CosyCasa à Porto Vecchio",
        "excerpt": "Cosy Casa Conciergerie Porto Vecchio vous propose un accompagnement sur mesure pour simplifier la gestion de vos locations saisonnières.",
        "meta_title": "Conciergerie CosyCasa à Porto Vecchio - cosycasa",
        "meta_description": "Conciergerie CosyCasa à Porto Vecchio – Services haut de gamme pour propriétaires et voyageurs : gestion locative, accueil, ménage et assistance 7j/7.",
        "content": """<p><strong>Cosy Casa</strong> Conciergerie Porto Vecchio vous propose un accompagnement sur mesure pour simplifier la gestion de vos locations saisonnières. Confiez l'organisation logistique à une équipe experte pour garantir à vos voyageurs un séjour fluide, haut de gamme et mémorable. Profitez d'une gestion locative professionnelle, alliant tranquillité d'esprit et performance optimale.</p>

<h2>Pourquoi choisir Cosy Casa pour votre gestion locative à Porto Vecchio</h2>
<p>Faire appel à Cosy Casa Conciergerie Porto Vecchio, c'est choisir une conciergerie haut de gamme spécialisée dans la gestion locative de courte durée. Porto Vecchio, perle du sud de la Corse, séduit par ses plages paradisiaques comme Palombaggia et Santa Giulia, sa citadelle animée et son ambiance méditerranéenne mêlant traditions corses et dolce vita.</p>
<p>Grâce à notre accompagnement personnalisé, votre bien gagne en visibilité et en rentabilité, tout en valorisant les atouts exceptionnels de Porto Vecchio. De la réservation à l'accueil, en passant par la coordination des services, notre équipe prend en charge chaque étape avec rigueur et réactivité. Avec Cosy Casa, bénéficiez d'un service de qualité qui met en lumière tout le potentiel de votre bien immobilier.</p>

<h2>Évaluation de votre projet</h2>
<p>Avant toute mise en gestion locative, nous réalisons une évaluation complète et stratégique de votre projet. Cela comprend une analyse approfondie du marché local à Porto Vecchio ainsi qu'une étude détaillée des caractéristiques de votre logement. À partir de cette base, nous élaborons une stratégie tarifaire sur mesure, ajustée pour maximiser la rentabilité de votre location saisonnière. Cette évaluation est mise à jour régulièrement pour garantir des performances durables et optimales.</p>

<h2>Une équipe dynamique et réactive</h2>
<p>Notre équipe est composée de professionnels passionnés par l'hospitalité et la gestion locative. Nous prenons le temps de comprendre vos attentes afin de vous proposer des solutions adaptées, efficaces et personnalisées. Notre priorité est votre satisfaction, à travers un accompagnement humain, rigoureux et toujours réactif. À Porto Vecchio, nous sommes à vos côtés pour faire de votre projet locatif une réussite.</p>

<h2>Un réseau de partenaires</h2>
<p>Cosy Casa travaille en collaboration avec un réseau local de partenaires de confiance à Porto Vecchio. Qu'il s'agisse du ménage, de la blanchisserie ou de la maintenance, nous sélectionnons avec soin des prestataires fiables, expérimentés et soucieux de la qualité. En assurant la coordination complète de ces services, nous vous garantissons une gestion fluide, professionnelle et une tranquillité d'esprit au quotidien.</p>

<h2>Gage de qualité</h2>
<p>Forte d'une solide expérience dans la gestion de biens touristiques, Cosy Casa s'impose comme une référence de la conciergerie haut de gamme à Porto Vecchio. Membre de réseaux de professionnels reconnus et partenaires de plateformes éthiques, nous mettons notre savoir-faire au service des propriétaires souhaitant une gestion locative fiable, transparente et rentable. Avec Cosy Casa, vous bénéficiez d'un accompagnement de confiance à chaque étape.</p>

<h2>Quelles sont nos avantages avec la conciergerie Cosy Casa ?</h2>

<h3>Gain de temps et d'argent</h3>
<p>Notre modèle repose sur une gestion locative performante et une optimisation constante de vos revenus. L'équipe Cosy Casa mobilise son expertise pour augmenter votre chiffre d'affaires locatif à Porto Vecchio tout en vous libérant des contraintes. Résultat : vous gagnez en sérénité et en rentabilité, sans effort.</p>

<h3>Service simplifié</h3>
<p>Avec Cosy Casa Conciergerie Porto Vecchio, bénéficiez d'un service tout inclus et fluide. Nous prenons en charge l'ensemble du processus : rédaction et publication des annonces, gestion des réservations, communication avec les voyageurs, accueil sur place… Vous restez informé tout en déléguant les tâches opérationnelles à une équipe experte et réactive.</p>

<h3>Engagement et responsabilité</h3>
<p>Nous nous engageons à maintenir votre bien dans un état irréprochable. Grâce à une équipe de prestataires professionnels et attentifs, chaque logement est préparé avec soin pour offrir aux voyageurs un service de qualité. Nettoyage, entretien, maintenance : tout est orchestré pour garantir une expérience haut de gamme à vos hôtes à Porto Vecchio, dans le respect de vos exigences.</p>"""
    },
}

async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    for slug, data in UPDATES.items():
        result = await db.blog_posts.update_one(
            {"slug": slug},
            {"$set": data}
        )
        print(f"Updated {slug}: matched={result.matched_count}, modified={result.modified_count}")
    
    client.close()

asyncio.run(main())
