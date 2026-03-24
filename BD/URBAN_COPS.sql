-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: urban1
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id_detalle` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) DEFAULT NULL,
  `nombre_producto` varchar(100) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `id_personalizacion` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `id_producto` (`id_producto`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,38,'Arizona Cardinals Classic','assets/img/arizona/images-removebg-preview.png',72,NULL,1,95000.00,95000.00),(2,39,'Arizona Cardinals Dark Edition','assets/img/arizona/negrayroja-removebg-preview.png',72,NULL,1,92000.00,92000.00),(3,40,'Arizona Cardinals Premium White','assets/img/arizona/blancaroja-removebg-preview.png',72,NULL,1,98000.00,98000.00),(4,38,'Arizona Cardinals Classic','assets/img/arizona/images-removebg-preview.png',73,NULL,3,95000.00,285000.00),(5,38,'Arizona Cardinals Classic','assets/img/arizona/images-removebg-preview.png',74,NULL,2,95000.00,190000.00),(6,38,'Arizona Cardinals Classic','assets/img/arizona/images-removebg-preview.png',75,NULL,1,95000.00,95000.00),(7,38,'Arizona Cardinals Classic','assets/img/arizona/images-removebg-preview.png',76,NULL,1,95000.00,95000.00),(8,39,'Arizona Cardinals Dark Edition','assets/img/arizona/negrayroja-removebg-preview.png',77,NULL,1,92000.00,92000.00),(9,39,'Arizona Cardinals Dark Edition','assets/img/arizona/negrayroja-removebg-preview.png',78,NULL,1,92000.00,92000.00),(10,74,'Atlanta Braves Classic Fit','assets/img/Braves/1-removebg-preview.png',79,NULL,1,95000.00,95000.00),(11,2,'Chicago Bulls','assets/img/chicago.png',80,NULL,1,95000.00,95000.00),(12,11,'Boston Celtics','assets/img/Raiders12.png',80,NULL,1,92000.00,92000.00),(13,20,'Los Angeles Lakers','assets/img/Lakers12.png',80,NULL,1,98000.00,98000.00),(14,47,'Las Vegas Raiders','assets/img/Raiders12.png',80,NULL,1,98000.00,98000.00),(15,13,'Boston Celtics White','assets/img/boston/celtics3-removebg-preview.png',85,NULL,1,98000.00,98000.00),(16,14,'Boston Celtics Dark Floral','assets/img/boston/descarga1.png',85,NULL,1,95000.00,95000.00),(17,2,'Chicago Bulls','assets/img/chicago.png',86,NULL,1,95000.00,95000.00),(18,11,'Boston Celtics','assets/img/Raiders12.png',86,NULL,1,92000.00,92000.00),(19,20,'Los Angeles Lakers','assets/img/Lakers12.png',86,NULL,1,98000.00,98000.00),(25,2,'Chicago Bulls','assets/img/chicago.png',88,NULL,1,95000.00,95000.00),(26,11,'Boston Celtics','assets/img/Raiders12.png',88,NULL,1,92000.00,92000.00),(27,2,'Chicago Bulls','assets/img/chicago.png',89,NULL,1,95000.00,95000.00),(28,2,'Chicago Bulls','assets/img/chicago.png',90,NULL,5,95000.00,475000.00),(29,2,'Chicago Bulls','assets/img/chicago.png',91,NULL,5,95000.00,475000.00),(30,2,'Chicago Bulls','assets/img/Bulls/1.png',93,NULL,1,95000.00,95000.00),(31,3,'Chicago Bulls Black','assets/img/Bulls/2-removebg-preview.png',93,NULL,1,92000.00,92000.00),(32,4,'Chicago Bulls Logo','assets/img/Bulls/3.png',93,NULL,1,98000.00,98000.00),(33,2,'Chicago Bulls','assets/img/chicago.png',94,NULL,1,95000.00,95000.00),(34,11,'Boston Celtics','assets/img/Raiders12.png',94,NULL,1,92000.00,92000.00),(35,20,'Los Angeles Lakers','assets/img/Lakers12.png',94,NULL,1,98000.00,98000.00),(36,11,'Boston Celtics','assets/img/Raiders12.png',95,NULL,1,92000.00,92000.00),(37,11,'Boston Celtics','assets/img/Raiders12.png',96,NULL,1,92000.00,92000.00),(38,2,'Chicago Bulls','assets/img/chicago.png',98,NULL,2,95000.00,190000.00),(39,11,'Boston Celtics','assets/img/Raiders12.png',98,NULL,1,92000.00,92000.00),(40,20,'Los Angeles Lakers','assets/img/Lakers12.png',98,NULL,1,98000.00,98000.00),(41,29,'Atlanta Falcons','assets/img/Atlanta12.png',98,NULL,1,95000.00,95000.00),(42,38,'Arizona Cardinals','assets/img/Arizona12.png',98,NULL,1,92000.00,92000.00),(43,47,'Las Vegas Raiders','assets/img/Raiders12.png',98,NULL,1,98000.00,98000.00),(44,3,'Chicago Bulls Black','assets/img/Bulls/2-removebg-preview.png',98,NULL,1,92000.00,92000.00),(45,4,'Chicago Bulls Logo','assets/img/Bulls/3.png',98,NULL,1,98000.00,98000.00),(46,5,'Chicago Bulls Red','assets/img/Bulls/4-removebg-preview.png',98,NULL,1,95000.00,95000.00),(47,6,'Chicago Bulls Blue Ice','assets/img/Bulls/5-removebg-preview.png',98,NULL,1,92000.00,92000.00),(48,7,'Chicago Bulls Hormada','assets/img/Bulls/6.png',98,NULL,1,98000.00,98000.00),(49,8,'Chicago Bulls Beige','assets/img/Bulls/7-removebg-preview.png',98,NULL,1,95000.00,95000.00),(50,9,'Chicago Blue','assets/img/Bulls/8-removebg-preview.png',98,NULL,1,92000.00,92000.00),(51,10,'Chicago Bulls Beige Hormada','assets/img/Bulls/9-removebg-preview.png',98,NULL,1,98000.00,98000.00),(52,11,'Boston Celtics Floral','assets/img/boston/celtics+-removebg-preview.png',98,NULL,1,95000.00,95000.00),(53,12,'Boston Celtics Classic','assets/img/boston/Adobe Express - file.png',98,NULL,1,92000.00,92000.00),(54,13,'Boston Celtics White','assets/img/boston/celtics3-removebg-preview.png',98,NULL,1,98000.00,98000.00),(55,14,'Boston Celtics Dark Floral','assets/img/boston/descarga1.png',98,NULL,1,95000.00,95000.00),(56,15,'Boston Celtics Black','assets/img/boston/descarga.png',98,NULL,1,92000.00,92000.00),(57,16,'Boston Celtics Green Visor','assets/img/boston/celtics22.png',98,NULL,1,98000.00,98000.00),(58,17,'Boston Celtics Fresh','assets/img/boston/celticsporksi-removebg-preview.png',98,NULL,1,95000.00,95000.00),(59,18,'Boston Celtics Green','assets/img/boston/celtics234.png',98,NULL,1,92000.00,92000.00),(60,19,'Boston Celtics Elite','assets/img/boston/Boston12.png',98,NULL,1,98000.00,98000.00),(61,20,'Lakers Classic','assets/img/Lakers/2-removebg-preview.png',98,NULL,1,95000.00,95000.00),(62,21,'Lakers Black','assets/img/Lakers/1-removebg-preview.png',98,NULL,1,92000.00,92000.00),(63,22,'Lakers Logo','assets/img/Lakers/3-removebg-preview.png',98,NULL,1,98000.00,98000.00),(64,23,'Lakers Edition 1','assets/img/Lakers/4-removebg-preview.png',98,NULL,1,95000.00,95000.00),(65,24,'Lakers Edition 2','assets/img/Lakers/5-removebg-preview.png',98,NULL,1,92000.00,92000.00),(66,25,'Lakers Edition 3','assets/img/Lakers/6-removebg-preview.png',98,NULL,1,98000.00,98000.00),(67,26,'Lakers Edition 4','assets/img/Lakers/7-removebg-preview.png',98,NULL,1,95000.00,95000.00),(68,27,'Lakers Edition 5','assets/img/Lakers/8-removebg-preview.png',98,NULL,1,92000.00,92000.00),(69,28,'Lakers Edition 6','assets/img/Lakers/9-removebg-preview.png',98,NULL,1,98000.00,98000.00),(70,29,'Atlanta Falcons Classic','assets/img/atlanta/10517894_1-removebg-preview.png',98,NULL,1,95000.00,95000.00),(71,30,'Atlanta Falcons Black','assets/img/atlanta/ATL-removebg-preview.png',98,NULL,1,92000.00,92000.00),(72,31,'Atlanta Falcons Logo','assets/img/atlanta/0ac1e7f183016ec72c3de6715c4a0e2a-removebg-preview.png',98,NULL,1,98000.00,98000.00),(73,32,'Falcons Blanca Tricolor','assets/img/atlanta/images-removebg-preview.png',98,NULL,1,95000.00,95000.00),(74,33,'Falcons Azul Hielo','assets/img/atlanta/10517894_1-removebg-preview.png',98,NULL,1,92000.00,92000.00),(75,34,'Falcons Roja Curva','assets/img/atlanta/images__2_-removebg-preview.png',98,NULL,1,98000.00,98000.00),(76,35,'Falcons Roja Clásica','assets/img/atlanta/atlantafalcoms2-removebg-preview.png',98,NULL,1,95000.00,95000.00),(77,36,'Falcons Blanca con Rojo','assets/img/atlanta/negraroja-removebg-preview.png',98,NULL,1,92000.00,92000.00),(78,37,'Falcons Gris Hormada','assets/img/atlanta/rojaynegra-removebg-preview.png',98,NULL,1,98000.00,98000.00),(79,38,'Arizona Cardinals Classic','assets/img/arizona/images-removebg-preview.png',98,NULL,1,95000.00,95000.00),(80,39,'Arizona Cardinals Dark Edition','assets/img/arizona/negrayroja-removebg-preview.png',98,NULL,1,92000.00,92000.00),(81,40,'Arizona Cardinals Premium White','assets/img/arizona/blancaroja-removebg-preview.png',98,NULL,1,98000.00,98000.00),(82,41,'Arizona Cardinals Black Series','assets/img/arizona/negra..-removebg-preview.png',98,NULL,1,95000.00,95000.00),(83,42,'Arizona Cardinals Tricolor','assets/img/arizona/tricolor-removebg-preview.png',98,NULL,1,92000.00,92000.00),(84,43,'Arizona Cardinals White Pro','assets/img/arizona/blanca_..-removebg-preview.png',98,NULL,1,98000.00,98000.00),(85,44,'Arizona Cardinals All Red','assets/img/arizona/totalroja-removebg-preview.png',98,NULL,1,95000.00,95000.00),(86,45,'Arizona Cardinals Gray Edition','assets/img/arizona/gris-removebg-preview.png',98,NULL,1,92000.00,92000.00),(87,46,'Arizona Cardinals Elite Black','assets/img/arizona/negralinda-removebg-preview.png',98,NULL,1,98000.00,98000.00),(88,47,'Vegas Raid Clásica Blanca','assets/img/vegas/blanca-removebg-preview.png',98,NULL,1,95000.00,95000.00),(89,48,'Vegas Raid Black','assets/img/vegas/negra-removebg-preview.png',98,NULL,1,92000.00,92000.00),(90,49,'Vegas Raid Premium Blanca','assets/img/vegas/blancaconnegra-removebg-preview.png',98,NULL,1,98000.00,98000.00),(91,50,'Vegas Raid Negra y Blanca','assets/img/vegas/bonita-removebg-preview (1).png',98,NULL,1,95000.00,95000.00),(92,52,'Vegas Raid Letras Edition','assets/img/vegas/letras-removebg-preview.png',98,NULL,1,98000.00,98000.00),(93,53,'Vegas Raid Logo White','assets/img/vegas/blancalogo-removebg-preview.png',98,NULL,1,95000.00,95000.00),(94,54,'Vegas Raid Triple X','assets/img/vegas/3x-removebg-preview.png',98,NULL,1,92000.00,92000.00),(95,55,'Vegas Raid Yellow Edition','assets/img/vegas/amarillo-removebg-preview.png',98,NULL,1,98000.00,98000.00),(96,56,'Boston Red Sox - Orgullo de Fenway','assets/img/Red/1-removebg-preview.png',98,NULL,1,95000.00,95000.00),(97,57,'Boston Red Sox - Leyenda Americana','assets/img/Red/2-removebg-preview.png',98,NULL,1,92000.00,92000.00),(98,58,'Boston Red Sox - Espíritu de Campeones','assets/img/Red/3-removebg-preview.png',98,NULL,1,98000.00,98000.00),(99,59,'Boston Red Sox - Tradición Inquebrantable','assets/img/Red/4-removebg-preview.png',98,NULL,1,95000.00,95000.00),(100,60,'Boston Red Sox - Estilo Beisbolero','assets/img/Red/5-removebg-preview.png',98,NULL,1,92000.00,92000.00),(101,61,'Boston Red Sox - Pasión Roja','assets/img/Red/6-removebg-preview.png',98,NULL,1,98000.00,98000.00),(102,62,'Boston Red Sox - Poder y Gloria','assets/img/Red/7-removebg-preview (1).png',98,NULL,1,95000.00,95000.00),(103,63,'Boston Red Sox - Clásico de Boston','assets/img/Red/8-removebg-preview.png',98,NULL,1,92000.00,92000.00),(104,64,'Boston Red Sox - Herencia Deportiva','assets/img/Red/9-removebg-preview.png',98,NULL,1,98000.00,98000.00),(105,65,'Chicago White Sox – Shadow of the South','assets/img/Sox/1-removebg-preview.png',98,NULL,1,95000.00,95000.00),(106,66,'Chicago White Sox – Eternal Pride','assets/img/Sox/2-removebg-preview.png',98,NULL,1,92000.00,92000.00),(107,67,'Chicago White Sox – Diamond Spirit','assets/img/Sox/3-removebg-preview.png',98,NULL,1,98000.00,98000.00),(108,68,'Chicago White Sox – Chicago Classic','assets/img/Sox/4-removebg-preview.png',98,NULL,1,95000.00,95000.00),(109,69,'Chicago White Sox – Black and White Style','assets/img/Sox/5-removebg-preview.png',98,NULL,1,92000.00,92000.00),(110,70,'Chicago White Sox – South Side Power','assets/img/Sox/6-removebg-preview.png',98,NULL,1,98000.00,98000.00),(111,71,'Chicago White Sox – Legendary Tradition','assets/img/Sox/7-removebg-preview.png',98,NULL,1,95000.00,95000.00),(112,72,'Chicago White Sox – Baseball Passion','assets/img/Sox/8-removebg-preview.png',98,NULL,1,92000.00,92000.00),(113,73,'Chicago White Sox – Urban Force','assets/img/Sox/9-removebg-preview.png',98,NULL,1,98000.00,98000.00),(114,74,'Atlanta Braves Classic Fit','assets/img/Braves/1-removebg-preview.png',98,NULL,1,95000.00,95000.00),(115,75,'Atlanta Braves Heritage Line','assets/img/Braves/2-removebg-preview.png',98,NULL,1,92000.00,92000.00),(116,76,'Atlanta Braves Night Game','assets/img/Braves/3-removebg-preview.png',98,NULL,1,98000.00,98000.00),(117,77,'Atlanta Braves Retro Swing','assets/img/Braves/4-removebg-preview.png',98,NULL,1,95000.00,95000.00),(118,78,'Atlanta Braves Southern Pride','assets/img/Braves/5-removebg-preview.png',98,NULL,1,92000.00,92000.00),(119,79,'Atlanta Braves Bold Edition','assets/img/Braves/6-removebg-preview.png',98,NULL,1,98000.00,98000.00),(120,80,'Atlanta Braves Street Style','assets/img/Braves/7-removebg-preview.png',98,NULL,1,95000.00,95000.00),(121,81,'Atlanta Braves Home Field','assets/img/Braves/8-removebg-preview.png',98,NULL,1,92000.00,92000.00),(122,82,'Atlanta Braves Legacy Cap','assets/img/Braves/9-removebg-preview.png',98,NULL,1,98000.00,98000.00);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envio`
--

DROP TABLE IF EXISTS `envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envio` (
  `id_envio` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado_envio` varchar(50) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_envio`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `envio_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envio`
--

LOCK TABLES `envio` WRITE;
/*!40000 ALTER TABLE `envio` DISABLE KEYS */;
INSERT INTO `envio` VALUES (2,72,'calle 56 b sur','Bogota','301230921','pendiente','2025-12-16 22:38:51'),(3,73,'calle 56 b','bogota','300129210','pendiente','2025-12-16 22:41:10'),(4,74,'nose','nose','123423','pendiente','2025-12-16 22:42:21'),(5,75,'calle','kadsljas','30293209','pendiente','2025-12-16 22:43:37'),(6,76,'calle 56','bogota','3021932','pendiente','2025-12-16 22:49:41'),(7,77,'hkjjk','ihjkj','378657565','pendiente','2025-12-16 22:53:23'),(8,78,'ukhkljk','ijuijk','34553543','pendiente','2025-12-16 22:54:33'),(9,79,'carrear murillo toro','tolima','31231','pendiente','2025-12-16 23:31:29'),(10,80,'carrera 4','bogota','31203219','pendiente','2025-12-17 12:32:53'),(11,82,'cr24, bogota. Tel: 31877661793',NULL,NULL,'pendiente','2025-12-17 21:15:20'),(12,83,'cr, bogota. Tel: 3187661793',NULL,NULL,'pendiente','2025-12-17 22:37:27'),(13,84,'calle 56 b sur, bofgota. Tel: 2132131232',NULL,NULL,'pendiente','2025-12-17 22:41:36'),(14,85,'calle 56 b sur','cali','31239812','pendiente','2026-02-03 22:19:36'),(15,86,'rfw3eewd','dwqedwq','312312','pendiente','2026-02-16 16:25:35'),(17,88,'fdsfdsds','dfsfsdf','21321321','pendiente','2026-03-02 04:11:45'),(18,89,'mnvb n','gnbvngv','123231123','pendiente','2026-03-02 19:45:18'),(19,90,'ewqeq','ewqewq','123213','pendiente','2026-03-02 19:46:44'),(20,91,'sasa','SAsa','2312','pendiente','2026-03-02 19:48:37'),(21,93,'calle 56 sur','usme','321321321','pendiente','2026-03-07 19:52:34'),(22,94,'213213','3213213','2313213215','pendiente','2026-03-07 21:01:43'),(23,95,'calle 123','kennedy','3213214431','pendiente','2026-03-07 21:06:25'),(24,96,'calscksd','dsadsa','3211234567','pendiente','2026-03-07 21:07:14'),(25,98,'murillo toro','natagaima','3182089862','pendiente','2026-03-07 22:20:26');
/*!40000 ALTER TABLE `envio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) DEFAULT NULL,
  `tipo` enum('entrada','salida','ajuste') DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `stock_resultante` int(11) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `id_referencia` int(11) DEFAULT NULL,
  `fecha_movimiento` datetime DEFAULT NULL,
  PRIMARY KEY (`id_inventario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,1,'ajuste',45,45,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(2,2,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(3,3,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(4,4,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(5,5,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(6,6,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(7,7,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(8,8,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(9,9,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(10,10,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(11,11,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(12,12,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(13,13,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(14,14,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(15,15,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(16,16,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(17,17,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(18,18,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(19,19,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(20,20,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(21,21,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(22,22,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(23,23,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(24,24,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(25,25,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(26,26,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(27,27,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(28,28,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(29,29,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(30,30,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(31,31,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(32,32,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(33,33,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(34,34,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(35,35,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(36,36,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(37,37,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(38,38,'ajuste',35,35,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(39,39,'ajuste',46,46,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(40,40,'ajuste',48,48,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(41,41,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(42,42,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(43,43,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(44,44,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(45,45,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(46,46,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(47,47,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(48,48,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(49,49,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(50,50,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(51,51,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(52,52,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(53,53,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(54,54,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(55,55,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(56,56,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(57,57,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(58,58,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(59,59,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(60,60,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(61,61,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(62,62,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(63,63,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(64,64,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(65,65,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(66,66,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(67,67,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(68,68,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(69,69,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(70,70,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(71,71,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(72,72,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(73,73,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(74,74,'ajuste',49,49,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(75,75,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(76,76,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(77,77,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(78,78,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(79,79,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(80,80,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(81,81,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(82,82,'ajuste',50,50,5,'Stock inicial - migración',NULL,'2026-02-19 18:33:37'),(83,2,'salida',1,49,5,'Pedido #93',NULL,'2026-03-07 19:52:34'),(84,3,'salida',1,49,5,'Pedido #93',NULL,'2026-03-07 19:52:34'),(85,4,'salida',1,49,5,'Pedido #93',NULL,'2026-03-07 19:52:34'),(86,2,'salida',1,48,5,'Pedido #94',NULL,'2026-03-07 21:01:43'),(87,11,'salida',1,49,5,'Pedido #94',NULL,'2026-03-07 21:01:43'),(88,20,'salida',1,49,5,'Pedido #94',NULL,'2026-03-07 21:01:43'),(89,11,'salida',1,48,5,'Pedido #95',NULL,'2026-03-07 21:06:25'),(90,11,'salida',1,47,5,'Pedido #96',NULL,'2026-03-07 21:07:14'),(91,12,'entrada',20,70,5,'compra marzo',NULL,'2026-03-07 22:13:29'),(92,2,'salida',2,46,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(93,11,'salida',1,46,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(94,20,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(95,29,'salida',1,50,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(96,38,'salida',1,35,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(97,47,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(98,3,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(99,4,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(100,5,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(101,6,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(102,7,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(103,8,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(104,9,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(105,10,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(106,11,'salida',1,45,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(107,12,'salida',1,69,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(108,13,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(109,14,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(110,15,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(111,16,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(112,17,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(113,18,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(114,19,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(115,20,'salida',1,47,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(116,21,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(117,22,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(118,23,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(119,24,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(120,25,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(121,26,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(122,27,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(123,28,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(124,29,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(125,30,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(126,31,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(127,32,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(128,33,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(129,34,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(130,35,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(131,36,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(132,37,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(133,38,'salida',1,34,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(134,39,'salida',1,45,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(135,40,'salida',1,47,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(136,41,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(137,42,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(138,43,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(139,44,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(140,45,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(141,46,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(142,47,'salida',1,47,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(143,48,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(144,49,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(145,50,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(146,52,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(147,53,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(148,54,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(149,55,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(150,56,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(151,57,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(152,58,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(153,59,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(154,60,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(155,61,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(156,62,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(157,63,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(158,64,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(159,65,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(160,66,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(161,67,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(162,68,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(163,69,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(164,70,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(165,71,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(166,72,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(167,73,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(168,74,'salida',1,48,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(169,75,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(170,76,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(171,77,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(172,78,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(173,79,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(174,80,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(175,81,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26'),(176,82,'salida',1,49,5,'Pedido #98',NULL,'2026-03-07 22:20:26');
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) DEFAULT NULL,
  `metodo_pago` varchar(255) DEFAULT NULL,
  `monto` varchar(100) DEFAULT NULL,
  `estado_pago` varchar(20) DEFAULT NULL,
  `referencia` varchar(100) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,9,'transferencia','39500','pendiente',NULL,'2025-12-14'),(2,10,'tarjeta_credito','21500','pendiente',NULL,'2025-10-02'),(3,11,'tarjeta_credito','47800','pendiente',NULL,'2025-10-02'),(4,82,'daviplata','285000','pendiente',NULL,'2025-12-17'),(5,83,'daviplata','475000','pendiente',NULL,'2025-12-17'),(6,84,'tarjeta','285000','pendiente',NULL,'2025-12-17'),(7,72,'efectivo','285000','completado',NULL,'2025-12-16'),(8,73,'efectivo','285000','completado',NULL,'2025-12-16'),(9,74,'efectivo','190000','completado',NULL,'2025-12-16'),(10,75,'efectivo','95000','completado',NULL,'2025-12-16'),(11,85,'nequi','193000','completado',NULL,'2026-02-03'),(12,86,'efectivo','285000','completado',NULL,'2026-02-16'),(13,88,'efectivo','187000','completado',NULL,'2026-03-02'),(14,89,'efectivo','95000','completado',NULL,'2026-03-02'),(15,90,'efectivo','475000','completado',NULL,'2026-03-02'),(16,91,'efectivo','475000','completado',NULL,'2026-03-02'),(17,93,'nequi','285000','completado',NULL,'2026-03-07'),(18,94,'efectivo','285000','completado',NULL,'2026-03-07'),(19,95,'efectivo','92000','completado',NULL,'2026-03-07'),(20,96,'efectivo','92000','completado',NULL,'2026-03-07'),(21,98,'efectivo','8173000','completado',NULL,'2026-03-07');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_pedido` date DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,'2025-03-13',72789.00,'pendiente',NULL,2),(2,'2024-12-30',87793.00,'pendiente',NULL,2),(3,'2025-01-15',35900.00,'pendiente',NULL,2),(4,'2025-02-20',12850.00,'pendiente',NULL,4),(5,'2025-03-01',54700.00,'pendiente',NULL,5),(6,'2025-03-25',23000.00,'pendiente',NULL,6),(7,'2025-04-10',17999.00,'pendiente',NULL,7),(8,'2025-04-15',84500.00,'pendiente',NULL,8),(9,'2025-05-05',39500.00,'pendiente',NULL,9),(10,'2025-05-10',21500.00,'pendiente',NULL,10),(11,'2025-05-20',47800.00,'pendiente',NULL,11),(12,'2025-06-01',19999.00,'pendiente',NULL,12),(13,'2025-06-10',56999.00,'pendiente',NULL,13),(14,'2025-06-15',35000.00,'pendiente',NULL,14),(15,'2025-06-20',29950.00,'pendiente',NULL,15),(16,'2025-07-01',42999.00,'pendiente',NULL,16),(17,'2025-07-05',51500.00,'pendiente',NULL,17),(18,'2025-07-08',66500.00,'pendiente',NULL,18),(19,'2025-07-09',38250.00,'pendiente',NULL,19),(20,'2025-07-09',49750.00,'pendiente',NULL,20),(21,'2025-07-09',71500.00,'pendiente',NULL,21),(22,'2025-07-09',28950.00,'pendiente',NULL,22),(23,'2025-07-09',61999.00,'pendiente',NULL,23),(24,'2025-07-09',54000.00,'pendiente',NULL,24),(25,'2025-07-09',47250.00,'pendiente',NULL,25),(26,'2025-06-01',95000.00,'pendiente',NULL,26),(27,'2025-06-01',150000.00,'pendiente',NULL,27),(28,'2025-06-02',120000.00,'pendiente',NULL,28),(29,'2025-06-02',98000.00,'pendiente',NULL,29),(30,'2025-06-03',105000.00,'pendiente',NULL,30),(31,'2025-06-03',89000.00,'pendiente',NULL,31),(32,'2025-06-04',135000.00,'pendiente',NULL,32),(33,'2025-06-04',99000.00,'pendiente',NULL,33),(34,'2025-06-05',142000.00,'pendiente',NULL,34),(35,'2025-06-05',88000.00,'pendiente',NULL,35),(36,'2025-06-06',115000.00,'pendiente',NULL,36),(37,'2025-06-06',102000.00,'pendiente',NULL,37),(38,'2025-06-07',97000.00,'pendiente',NULL,38),(39,'2025-06-07',113000.00,'pendiente',NULL,39),(40,'2025-06-08',125000.00,'pendiente',NULL,40),(41,'2025-06-08',131000.00,'pendiente',NULL,41),(42,'2025-06-09',109000.00,'pendiente',NULL,42),(43,'2025-06-09',92000.00,'pendiente',NULL,43),(44,'2025-06-10',118000.00,'pendiente',NULL,44),(45,'2025-06-10',95000.00,'pendiente',NULL,45),(46,'2025-06-11',104000.00,'pendiente',NULL,46),(47,'2025-06-11',96000.00,'pendiente',NULL,47),(48,'2025-06-12',129000.00,'pendiente',NULL,48),(49,'2025-06-12',99000.00,'pendiente',NULL,49),(50,'2025-06-13',97000.00,'pendiente',NULL,50),(51,'2025-10-03',125000.00,'pendiente',NULL,25),(52,'2025-10-03',23.00,'pendiente',NULL,1),(53,'2025-10-03',2000.00,'pendiente',NULL,33),(54,'2025-10-03',2000.00,'pendiente',NULL,22),(55,'2025-12-10',187000.00,'pendiente',NULL,78),(56,'2025-12-10',285000.00,'pendiente',NULL,78),(57,'2025-12-10',92000.00,'pendiente',NULL,78),(58,'2025-12-10',190000.00,'pendiente',NULL,78),(59,'2025-12-10',190000.00,'pendiente',NULL,79),(60,'2025-12-10',475000.00,'pendiente',NULL,71),(61,'2025-12-13',285000.00,'pendiente',NULL,82),(62,'2025-12-13',285000.00,'pendiente',NULL,82),(64,'2025-12-13',50000.00,'pendiente',NULL,1),(65,'2025-12-13',50000.00,'pendiente',NULL,1),(66,'2025-12-13',75000.00,'pendiente',NULL,1),(67,'2025-12-13',100000.00,'pendiente',NULL,2),(70,'2025-12-14',98000.00,'pendiente',NULL,85),(71,'2025-12-16',190000.00,'pendiente',NULL,85),(72,'2025-12-16',285000.00,'pendiente','efectivo',85),(73,'2025-12-16',285000.00,'pendiente','efectivo',85),(74,'2025-12-16',190000.00,'pendiente','efectivo',85),(75,'2025-12-16',95000.00,'pendiente','efectivo',85),(76,'2026-02-03',95000.00,'pendiente','efectivo',85),(77,'2025-12-16',92000.00,'pendiente','efectivo',85),(78,'2025-12-16',92000.00,'pendiente','efectivo',85),(79,'2025-12-16',95000.00,'pendiente','efectivo',85),(80,'2025-12-17',383000.00,'pendiente','tarjeta',85),(81,'2026-02-03',980809.00,'pendiente',NULL,82),(82,'2025-12-17',285000.00,'pendiente',NULL,82),(83,'2025-12-17',475000.00,'pendiente',NULL,82),(84,'2025-12-17',285000.00,'pendiente',NULL,85),(85,'2026-02-03',193000.00,'pendiente','nequi',85),(86,'2026-02-16',285000.00,'pendiente','efectivo',85),(88,'2026-03-02',187000.00,'pendiente','efectivo',85),(89,'2026-03-02',95000.00,'pendiente','efectivo',85),(90,'2026-03-02',475000.00,'pendiente','efectivo',85),(91,'2026-03-02',475000.00,'en_proceso','efectivo',85),(92,'2026-03-03',130000.00,'en_proceso',NULL,85),(93,'2026-03-07',285000.00,'pendiente','nequi',94),(94,'2026-03-07',285000.00,'pendiente','efectivo',94),(95,'2026-03-07',92000.00,'pendiente','efectivo',94),(96,'2026-03-07',92000.00,'pendiente','efectivo',94),(97,'2026-03-07',150000.00,'pendiente',NULL,94),(98,'2026-03-07',8173000.00,'pendiente','efectivo',71);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personalizacion`
--

DROP TABLE IF EXISTS `personalizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personalizacion` (
  `id_personalizacion` int(11) NOT NULL AUTO_INCREMENT,
  `id_pedido` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `descripcion_personalizacion` varchar(100) DEFAULT NULL,
  `tipo_personalizacion` varchar(50) DEFAULT NULL,
  `imagen_referencia` varchar(500) DEFAULT NULL,
  `color_deseado` varchar(60) DEFAULT NULL,
  `talla` varchar(10) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `precio_adicional` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_personalizacion`),
  KEY `id_pedido` (`id_pedido`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `personalizacion_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`),
  CONSTRAINT `personalizacion_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personalizacion`
--

LOCK TABLES `personalizacion` WRITE;
/*!40000 ALTER TABLE `personalizacion` DISABLE KEYS */;
INSERT INTO `personalizacion` VALUES (1,1,NULL,'Gorra New Era personalizada con bordado del logo del cliente.',NULL,NULL,NULL,NULL,'pendiente',0.00),(2,2,NULL,'Gorra New Era con iniciales en los paneles laterales.',NULL,NULL,NULL,NULL,'pendiente',0.00),(3,3,NULL,'Diseño exclusivo en la visera de la gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(4,4,NULL,'Bordado 3D del nombre en la parte frontal de la gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(5,5,NULL,'Gorra New Era edición limitada con parches personalizados.',NULL,NULL,NULL,NULL,'pendiente',0.00),(6,6,NULL,'Colores personalizados para la gorra New Era, tono azul y blanco.',NULL,NULL,NULL,NULL,'pendiente',0.00),(7,7,NULL,'Bordado lateral con frase motivadora en gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(8,8,NULL,'Gorra New Era con bandera nacional bordada en el lateral.',NULL,NULL,NULL,NULL,'pendiente',0.00),(9,9,NULL,'Diseño vintage en la gorra New Era, efecto desgastado.',NULL,NULL,NULL,NULL,'pendiente',0.00),(10,10,NULL,'Personalización con bordado metálico en gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(11,11,NULL,'Visera curva con diseño camuflado personalizado en gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(12,12,NULL,'Gorra New Era con logo personalizado en la parte trasera.',NULL,NULL,NULL,NULL,'pendiente',0.00),(13,13,NULL,'Edición especial de gorra New Era con detalles en cuero.',NULL,NULL,NULL,NULL,'pendiente',0.00),(14,14,NULL,'Bordado de equipo deportivo favorito en la gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(15,15,NULL,'Personalización minimalista en gorra New Era, bordado pequeño frontal.',NULL,NULL,NULL,NULL,'pendiente',0.00),(16,16,NULL,'Gorra New Era con iniciales del cliente en la visera.',NULL,NULL,NULL,NULL,'pendiente',0.00),(17,17,NULL,'Colores neón personalizados en la gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(18,18,NULL,'Gorra New Era edición urbana con parches de ciudad.',NULL,NULL,NULL,NULL,'pendiente',0.00),(19,19,NULL,'Frase personalizada bordada en la parte interior de la gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(20,20,NULL,'Gorra New Era con detalles en hilo dorado.',NULL,NULL,NULL,NULL,'pendiente',0.00),(21,21,NULL,'Diseño exclusivo con logo retro en gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(22,22,NULL,'Bordado lateral con fecha memorable en gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(23,23,NULL,'Gorra New Era personalizada con efecto tie-dye.',NULL,NULL,NULL,NULL,'pendiente',0.00),(24,24,NULL,'Detalles bordados en relieve en la parte frontal de la gorra New Era.',NULL,NULL,NULL,NULL,'pendiente',0.00),(25,25,NULL,'Gorra New Era con diseño personalizado para evento empresarial.',NULL,NULL,NULL,NULL,'pendiente',0.00),(26,26,NULL,'Logo bordado Chicago Bulls',NULL,NULL,NULL,NULL,'pendiente',0.00),(27,26,NULL,'Nombre personalizado Boston Celtics',NULL,NULL,NULL,NULL,'pendiente',0.00),(28,27,NULL,'Estilo urbano Los Angeles Lakers',NULL,NULL,NULL,NULL,'pendiente',0.00),(29,28,NULL,'Iniciales en visera Atlanta Falcons',NULL,NULL,NULL,NULL,'pendiente',0.00),(30,29,NULL,'Sello holográfico Arizona Cardinals',NULL,NULL,NULL,NULL,'pendiente',0.00),(31,30,NULL,'Letra personalizada Las Vegas Raiders',NULL,NULL,NULL,NULL,'pendiente',0.00),(32,31,NULL,'Nombre con relieve Boston Red Sox',NULL,NULL,NULL,NULL,'pendiente',0.00),(33,32,NULL,'Frase en costado White Sox',NULL,NULL,NULL,NULL,'pendiente',0.00),(34,33,NULL,'Colores degradados Atlanta Braves',NULL,NULL,NULL,NULL,'pendiente',0.00),(35,34,NULL,'Bordado vintage Chicago Bulls',NULL,NULL,NULL,NULL,'pendiente',0.00),(36,35,NULL,'Número de jugador Boston Celtics',NULL,NULL,NULL,NULL,'pendiente',0.00),(37,36,NULL,'Logo alternativo Los Angeles Lakers',NULL,NULL,NULL,NULL,'pendiente',0.00),(38,37,NULL,'Bordado atlanta lateral Atlanta Falcons',NULL,NULL,NULL,NULL,'pendiente',0.00),(39,38,NULL,'Iniciales tribales Arizona Cardinals',NULL,NULL,NULL,NULL,'pendiente',0.00),(40,39,NULL,'Visera camuflada Raiders',NULL,NULL,NULL,NULL,'pendiente',0.00),(41,40,NULL,'Nombre oculto Red Sox',NULL,NULL,NULL,NULL,'pendiente',0.00),(42,41,NULL,'Firma del fan White Sox',NULL,NULL,NULL,NULL,'pendiente',0.00),(43,42,NULL,'Escudo retro Atlanta Braves',NULL,NULL,NULL,NULL,'pendiente',0.00),(44,43,NULL,'Icono urbano Celtics',NULL,NULL,NULL,NULL,'pendiente',0.00),(45,44,NULL,'Letras góticas Bulls',NULL,NULL,NULL,NULL,'pendiente',0.00),(46,45,NULL,'Logo invertido Lakers',NULL,NULL,NULL,NULL,'pendiente',0.00),(47,46,NULL,'Color invertido Falcons',NULL,NULL,NULL,NULL,'pendiente',0.00),(48,47,NULL,'Visera ancha Cardinals',NULL,NULL,NULL,NULL,'pendiente',0.00),(49,48,NULL,'Parche clásico Raiders',NULL,NULL,NULL,NULL,'pendiente',0.00),(50,49,NULL,'Etiqueta exclusiva Red Sox',NULL,NULL,NULL,NULL,'pendiente',0.00),(53,81,NULL,NULL,NULL,NULL,NULL,NULL,'en_proceso',980809.00),(54,92,NULL,'quiweero una de minecraft','estampado','data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAIeCAYAAACr5/ZrAAAQAElEQVR4Aex9B4AkVbX2qeruyXkzu+wuOSg5CRJUMD8DhicoYn7GZ/qNKIqIgqIPwzMrICASVBTQR1AQkSAgOS1szjM7sxN7ejr/5zvdt6a6u7qnu6dDVfedra/uveeee86551Y8e+u2+aIzXpQ8/szjUzjj+ORhrzksecoZpyV/+ptbk1fdcL+rEWhtTyp0dPYkge6e/qQdbR1dyZa2Dgv2OuTRpqd3gav7WctxuJLHXOP+ZMV98AeW6UHcfOea5MNrJvPi1gcmk1+4dDL5+V9piA9+yX7Ig88xvRYQO+Y5HhhTO865fCpZLL7066lkMfjyFcHkuVcWh/OuDiWLwdd+G0qef82M4ILrZpIK37h+JpmNC38fThaDb90QTV78p5iFq25+PHntzQ/m4Lo/P5gsFtf/5cFkMfjdLQ8lgd9zW','la quieroi negra','M','aprobada',130000.00),(55,97,NULL,'dssad','estampado',NULL,'amarillo','XL','aprobada',150000.00);
/*!40000 ALTER TABLE `personalizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pqrs`
--

DROP TABLE IF EXISTS `pqrs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pqrs` (
  `id_pqrs` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `tipo_pqrs` enum('Peticion','Queja','Reclamo','Sugerencia') DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` enum('Pendiente','En Proceso','Resuelto','Cerrado') DEFAULT NULL,
  `respuesta` text DEFAULT NULL,
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_respuesta` timestamp NULL DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pqrs`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `pqrs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pqrs`
--

LOCK TABLES `pqrs` WRITE;
/*!40000 ALTER TABLE `pqrs` DISABLE KEYS */;
INSERT INTO `pqrs` VALUES (2,'Omar','omarnino054@gmail.com','Queja','q','En Proceso','1','2025-12-13 23:29:59',NULL,NULL),(5,'Sofi','sofi@gmail.com','Peticion','nose','Pendiente','','2025-12-14 04:02:28',NULL,NULL),(6,'omr','omar@gmail.com','Queja','1','Pendiente','','2025-12-17 21:13:55',NULL,NULL),(7,'sofi yarear','soijksdfewhjew@gmaio.com','Reclamo','ohtugiougferifheriufhqerfue','Pendiente','','2025-12-17 21:31:35',NULL,NULL),(8,'omar','sofi@gmail.com','Peticion','aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','Pendiente','','2025-12-17 21:43:50',NULL,NULL),(9,'aaaa','omar@gmail.com','Sugerencia','11111111111111111111111111111111111111111111','Pendiente','','2025-12-17 21:44:24',NULL,NULL),(10,'omar','omar@gmail.com','Sugerencia','1','Resuelto','que es eso?','2025-12-17 21:56:33','2026-02-26 20:07:35',NULL),(11,'omar','omar@gmail.com','Reclamo','1234','Resuelto','','2025-12-17 22:45:17',NULL,NULL),(12,'John Yara','fer@gmail.com','Queja','no sirve ya que lo estoy intentando hace rato','Resuelto','estamos en mantenimiento','2026-02-19 23:17:17','2026-02-26 19:59:36',NULL),(13,'Sofia Yara','Sofi@gmail.com','Queja','esto no sirve por el simple echo de que no registra nada','Pendiente','','2026-02-26 20:09:20',NULL,NULL),(14,'SOfia','FER@GMAIL.COM','Peticion','dsadsadadsadasdsadAWD','Pendiente','','2026-02-26 20:12:20',NULL,NULL),(15,'SOfi','Sofi@gmail.com','Queja','no sirveeeeeeeeeeeeeeeeeeeeeeee','Pendiente','','2026-02-26 20:21:39',NULL,NULL),(16,'drfssfsdf','fdsfds@fgdg.com','Queja','rfdsfssdsadasDDASSDASDA','Pendiente','','2026-02-26 20:24:56',NULL,NULL),(17,'dsadsad','dsadsads@gmail.com','Peticion','refwa<esdesfdfdsfdsfsdfds','Pendiente','','2026-02-26 20:27:37',NULL,NULL),(18,'Sofi Yara','sofi@gmail.com','Reclamo','dssadasdasdasdasddasdsad','Resuelto','estamos trabajando en eso','2026-02-26 20:30:35','2026-03-07 20:37:56',85);
/*!40000 ALTER TABLE `pqrs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_base` decimal(10,2) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `stock_disponible` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Gorra urbana','Gorra 100% algodon',95.00,'Gorras',45,1,'2025-12-16 13:56:58',NULL),(2,'Chicago Bulls - Shadow Edition','Gorra negra con logo bordado y dise?o premium',95000.00,'NBA',46,1,'2025-12-16 14:21:49','assets/img/chicago.png'),(3,'Chicago Bulls - Classic Red','Gorra roja cl?sica con visera plana y escudo bordado',92000.00,'NBA',48,1,'2025-12-16 14:21:49','assets/img/Bulls/2-removebg-preview.png'),(4,'Chicago Bulls - Premium Black','Edici?n premium negra con detalles en rojo',98000.00,'NBA',48,1,'2025-12-16 14:21:49','assets/img/Bulls/3.png'),(5,'Chicago Bulls - Vintage 90s','Dise?o retro inspirado en los a?os 90',95000.00,'NBA',49,1,'2025-12-16 14:21:49','assets/img/Bulls/4-removebg-preview.png'),(6,'Chicago Bulls - Windy City Edition','Colecci?n especial de la ciudad del viento',92000.00,'NBA',49,1,'2025-12-16 14:21:49','assets/img/Bulls/5-removebg-preview.png'),(7,'Chicago Bulls - Championship Legacy','Homenaje a los 6 campeonatos con detalles dorados',98000.00,'NBA',49,1,'2025-12-16 14:21:49','assets/img/Bulls/6.png'),(8,'Chicago Bulls - Street Style','Dise?o urbano con acabados modernos',95000.00,'NBA',49,1,'2025-12-16 14:21:49','assets/img/Bulls/7-removebg-preview.png'),(9,'Chicago Bulls - Classic Icon','Gorra ic?nica con logo tradicional bordado',92000.00,'NBA',49,1,'2025-12-16 14:21:49','assets/img/Bulls/8-removebg-preview.png'),(10,'Chicago Bulls - Urban Legend','Edici?n limitada con estilo urbano ?nico',98000.00,'NBA',49,1,'2025-12-16 14:21:49','assets/img/Bulls/9-removebg-preview.png'),(11,'Boston Celtics - Irish Pride','Verde cl?sico con tr?bol bordado',95000.00,'NBA',45,1,'2025-12-16 14:22:05','assets/img/boston/celtics+-removebg-preview.png'),(12,'Boston Celtics - Banner 18','Edici?n especial honrando los 18 campeonatos',92000.00,'NBA',69,1,'2025-12-16 14:22:05','assets/img/boston/Adobe Express - file.png'),(13,'Boston Celtics - Parquet Classic','Inspirada en el legendario parquet del TD Garden',98000.00,'NBA',48,1,'2025-12-16 14:22:05','assets/img/boston/celtics3-removebg-preview.png'),(14,'Boston Celtics - Retro Green','Dise?o retro en verde Boston tradicional',95000.00,'NBA',48,1,'2025-12-16 14:22:05','assets/img/boston/descarga1.png'),(15,'Boston Celtics - Black Edition','Versi?n negra con detalles verdes brillantes',92000.00,'NBA',49,1,'2025-12-16 14:22:05','assets/img/boston/descarga.png'),(16,'Boston Celtics - Championship Gold','Gorra con detalles dorados y tr?bol premium',98000.00,'NBA',49,1,'2025-12-16 14:22:05','assets/img/boston/celtics22.png'),(17,'Boston Celtics - Urban Celtic','Estilo urbano con logo moderno',95000.00,'NBA',49,1,'2025-12-16 14:22:05','assets/img/boston/celticsporksi-removebg-preview.png'),(18,'Boston Celtics - Heritage Collection','Colecci?n homenaje a la historia del equipo',92000.00,'NBA',49,1,'2025-12-16 14:22:05','assets/img/boston/celtics234.png'),(19,'Boston Celtics - Lucky Edition','Edici?n de la suerte con tr?bol bordado 3D',98000.00,'NBA',49,1,'2025-12-16 14:22:05','assets/img/boston/Boston12.png'),(20,'Lakers - Showtime Gold','Dorada con detalles morados, estilo Showtime',95000.00,'NBA',47,1,'2025-12-16 14:22:17','assets/img/Lakers/2-removebg-preview.png'),(21,'Lakers - Purple Reign','Morada cl?sica con logo Lakers bordado',92000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/1-removebg-preview.png'),(22,'Lakers - Black Mamba Tribute','Homenaje a Kobe Bryant en negro y dorado',98000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/3-removebg-preview.png'),(23,'Lakers - Hollywood Nights','Dise?o inspirado en las noches de Hollywood',95000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/4-removebg-preview.png'),(24,'Lakers - Championship Legacy','17 t?tulos representados con detalles especiales',92000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/5-removebg-preview.png'),(25,'Lakers - Retro Magic','Dise?o retro de la era Magic Johnson',98000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/6-removebg-preview.png'),(26,'Lakers - City Edition','Edici?n especial de la ciudad de Los ?ngeles',95000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/7-removebg-preview.png'),(27,'Lakers - Gold Standard','Gorra premium en dorado con acabados de lujo',92000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/8-removebg-preview.png'),(28,'Lakers - Purple & Gold Classic','Combinaci?n cl?sica morado y dorado',98000.00,'NBA',49,1,'2025-12-16 14:22:17','assets/img/Lakers/9-removebg-preview.png'),(29,'Falcons - Rise Up Red','Roja con logo Falcons bordado y slogan Rise Up',95000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/10517894_1-removebg-preview.png'),(30,'Falcons - Dirty Bird Black','Negra con detalles rojos y logo cl?sico',92000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/ATL-removebg-preview.png'),(31,'Falcons - ATL Edition','Edici?n especial de Atlanta con dise?o urbano',98000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/0ac1e7f183016ec72c3de6715c4a0e2a-removebg-preview.png'),(32,'Falcons - Red Zone','Roja intensa con logo 3D bordado',95000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/images-removebg-preview.png'),(33,'Falcons - Brotherhood Black','Negra con detalles plateados premium',92000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/10517894_1-removebg-preview.png'),(34,'Falcons - Home Field','Dise?o inspirado en el Mercedes-Benz Stadium',98000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/images__2_-removebg-preview.png'),(35,'Falcons - Throwback Classic','Dise?o retro de los a?os 90',95000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/atlantafalcoms2-removebg-preview.png'),(36,'Falcons - Victory Red','Roja con acabados met?licos',92000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/negraroja-removebg-preview.png'),(37,'Falcons - Elite Edition','Edici?n elite con materiales premium',98000.00,'NFL',49,1,'2025-12-16 14:22:28','assets/img/atlanta/rojaynegra-removebg-preview.png'),(38,'Cardinals - Desert Red','Roja intensa con logo Cardinals bordado',95000.00,'NFL',34,1,'2025-12-16 14:22:39','assets/img/arizona/images-removebg-preview.png'),(39,'Cardinals - Black Attack','Negra con detalles rojos y blancos',92000.00,'NFL',45,1,'2025-12-16 14:22:39','assets/img/arizona/negrayroja-removebg-preview.png'),(40,'Cardinals - White Desert','Blanca con detalles rojos, perfecta para verano',98000.00,'NFL',47,1,'2025-12-16 14:22:39','assets/img/arizona/blancaroja-removebg-preview.png'),(41,'Cardinals - Arizona Pride','Tricolor representando los colores de Arizona',95000.00,'NFL',49,1,'2025-12-16 14:22:39','assets/img/arizona/negra..-removebg-preview.png'),(42,'Cardinals - Cardinal Red','Rojo cardinal cl?sico con bordado premium',92000.00,'NFL',49,1,'2025-12-16 14:22:39','assets/img/arizona/tricolor-removebg-preview.png'),(43,'Cardinals - State Edition','Edici?n especial del estado de Arizona',98000.00,'NFL',49,1,'2025-12-16 14:22:39','assets/img/arizona/blanca_..-removebg-preview.png'),(44,'Cardinals - Total Red','Completamente roja con logo tonal',95000.00,'NFL',49,1,'2025-12-16 14:22:39','assets/img/arizona/totalroja-removebg-preview.png'),(45,'Cardinals - Grey Storm','Gris con detalles rojos y logo destacado',92000.00,'NFL',49,1,'2025-12-16 14:22:39','assets/img/arizona/gris-removebg-preview.png'),(46,'Cardinals - Premium Black','Negra premium con acabados de alta calidad',98000.00,'NFL',49,1,'2025-12-16 14:22:39','assets/img/arizona/negralinda-removebg-preview.png'),(47,'Raiders - Classic Silver & Black','Blanca con visera plana y escudo frontal bordado',95000.00,'NFL',47,1,'2025-12-16 14:22:49','assets/img/vegas/blanca-removebg-preview.png'),(48,'Raiders - Black Hole Edition','Negra con detalles en plata y logotipo en alto relieve',92000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/negra-removebg-preview.png'),(49,'Raiders - Premium White','Blanca con detalles en negro y logo bordado premium',98000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/blancaconnegra-removebg-preview.png'),(50,'Raiders - Commitment to Excellence','Negra con panel blanco y slogan lateral',95000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/bonita-removebg-preview (1).png'),(51,'Raiders - Tricolor Nation','Negra con visera blanca y detalles modernos',92000.00,'NFL',50,1,'2025-12-16 14:22:49',NULL),(52,'Raiders - Shield Edition','Dise?o con escudo Raiders destacado',98000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/letras-removebg-preview.png'),(53,'Raiders - Vegas Lights','Edici?n especial de Las Vegas con detalles ?nicos',95000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/blancalogo-removebg-preview.png'),(54,'Raiders - Triple X','Panel frontal blanco con visera gris',92000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/3x-removebg-preview.png'),(55,'Raiders - Yellow Accent','Edici?n especial con detalles dorados',98000.00,'NFL',49,1,'2025-12-16 14:22:49','assets/img/vegas/amarillo-removebg-preview.png'),(56,'Red Sox - Shadow of the South','Gorra New Era de la colecci?n MLB Classic',95000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/1-removebg-preview.png'),(57,'Red Sox - Eternal Pride','Gorra con logotipo bordado y dise?o premium',92000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/2-removebg-preview.png'),(58,'Red Sox - Diamond Spirit','Modelo cl?sico con detalles bordados oficiales',98000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/3-removebg-preview.png'),(59,'Red Sox - Boston Classic','Gorra New Era multi color estilo Boston',95000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/4-removebg-preview.png'),(60,'Red Sox - Navy & Red Style','Azul marino con detalles rojos caracter?sticos',92000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/5-removebg-preview.png'),(61,'Red Sox - Fenway Power','Inspirada en el legendario Fenway Park',98000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/6-removebg-preview.png'),(62,'Red Sox - Championship Legacy','Homenaje a los t?tulos de la Serie Mundial',95000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/7-removebg-preview (1).png'),(63,'Red Sox - Baseball Passion','Dise?o que refleja la pasi?n por el b?isbol',92000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/8-removebg-preview.png'),(64,'Red Sox - Urban Force','Estilo urbano con logo Red Sox moderno',98000.00,'MLB',49,1,'2025-12-16 14:23:01','assets/img/Red/9-removebg-preview.png'),(65,'White Sox - Shadow of the South','Gorra New Era 59FIFTY de la colecci?n MLB Classic',95000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/1-removebg-preview.png'),(66,'White Sox - Eternal Pride','Gorra con logotipo bordado y dise?o premium',92000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/2-removebg-preview.png'),(67,'White Sox - Diamond Spirit','Modelo cl?sico con detalles bordados oficiales',98000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/3-removebg-preview.png'),(68,'White Sox - Chicago Classic','Gorra New Era multi color estilo Chicago',95000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/4-removebg-preview.png'),(69,'White Sox - Black and White Style','Dise?o ic?nico en blanco y negro',92000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/5-removebg-preview.png'),(70,'White Sox - South Side Power','Representando el orgullo del South Side',98000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/6-removebg-preview.png'),(71,'White Sox - Legendary Tradition','Homenaje a la tradici?n del equipo',95000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/7-removebg-preview.png'),(72,'White Sox - Baseball Passion','Pasi?n por el b?isbol en cada detalle',92000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/8-removebg-preview.png'),(73,'White Sox - Urban Force','Fuerza urbana con estilo moderno',98000.00,'MLB',49,1,'2025-12-16 14:23:17','assets/img/Sox/9-removebg-preview.png'),(74,'Braves - Tomahawk Chop Red','Roja con el ic?nico logo Braves bordado',95000.00,'MLB',48,1,'2025-12-16 14:24:42','assets/img/Braves/1-removebg-preview.png'),(75,'Braves - Navy Classic','Azul marino cl?sico con letra A bordada',92000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/2-removebg-preview.png'),(76,'Braves - Championship Edition','Edici?n especial de los campeones 2021',98000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/3-removebg-preview.png'),(77,'Braves - ATL Pride','Gorra con orgullo de Atlanta bordado',95000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/4-removebg-preview.png'),(78,'Braves - Red & Navy','Combinaci?n roja y azul marino tradicional',92000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/5-removebg-preview.png'),(79,'Braves - Retro Tomahawk','Dise?o retro con hacha bordada',98000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/6-removebg-preview.png'),(80,'Braves - World Series','Conmemorativa de la Serie Mundial',95000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/7-removebg-preview.png'),(81,'Braves - Urban Atlanta','Estilo urbano con detalles modernos',92000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/8-removebg-preview.png'),(82,'Braves - Premium Navy','Azul marino premium con acabados de lujo',98000.00,'MLB',49,1,'2025-12-16 14:24:42','assets/img/Braves/9-removebg-preview.png');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro`
--

DROP TABLE IF EXISTS `registro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `rol` varchar(100) NOT NULL,
  PRIMARY KEY (`id_registro`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `registro_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro`
--

LOCK TABLES `registro` WRITE;
/*!40000 ALTER TABLE `registro` DISABLE KEYS */;
/*!40000 ALTER TABLE `registro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `nombre_rol` varchar(45) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,1,'super_admin','Super Administrador con acceso total'),(2,2,'Usuario','Cliente del sistema'),(3,NULL,'admin','Administrador con permisos limitados');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `documento` varchar(45) DEFAULT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `clave` varchar(200) DEFAULT NULL,
  `usuario` varchar(45) DEFAULT NULL,
  `id_rol` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'juana','Condenado','1011','barberodaniela@hotmail.com','59c1ea7c13a40c04391b0989c6f1e01a975c85b1d5fb126d3daf16d12440ada0','adoración.conde',2),(2,'Odalys','Vicente','95593169','p@sqaassasa','6fc80360eec34fdf5daf812fcb2ad73a701e9908073e9d8cf3ae5f339c3c5fe7','odalys.vicente',3),(3,'Mateo','López','12345678','mateo.lopez@example.com','a3f1c93f845e489c92e55b9c5b3d2431','mateo.lopez',3),(4,'Sofía','Martínez','87654321','sofia.martinez@example.com','7c4a8d09ca3762af61e59520943dc26494f8941b','sofia.martinez',3),(5,'Lucas','lopez','11223344','lucas.garcia@example.com','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','lucas.garcia',3),(6,'Emma','Rodríguez','22334455','emma.rodriguez@example.com','2aae6c35c94fcfb415dbe95f408b9ce91ee846ed','emma.rodriguez',3),(7,'Leo','Hernández','33445566','leo.hernandez@example.com','6b3a55e0261b0304143f805a249c02f2c21617f1','leo.hernandez',3),(8,'Isabella','Fernández','44556677','isabella.fernandez@example.com','e38ad214943daad1d64c102faec29de4afe9da3d','isabella.fernandez',3),(9,'Daniel','Gómez','55667788','daniel.gomez@example.com','8f14e45fceea167a5a36dedd4bea2543','daniel.gomez',3),(10,'Valentina','Díaz','66778899','valentina.diaz@example.com','45c48cce2e2d7fbdea1afc51c7c6ad26','valentina.diaz',3),(11,'Alejandro','Santos','77889900','alejandro.santos@example.com','d3d9446802a44259755d38e6d163e820','alejandro.santos',3),(12,'Mía','Cruz','88990011','mia.cruz@example.com','6512bd43d9caa6e02c990b0a82652dca','mia.cruz',3),(13,'Sebastián','Morales','99001122','sebastian.morales@example.com','c20ad4d76fe97759aa27a0c99bff6710','sebastian.morales',3),(14,'Camilo','nino','10111213','camila.ortega@example.com','c51ce410c124a10e0db5e4b97fc2af39','camila.ortega',3),(15,'Diego','Ramírez','12131415','diego.ramirez@example.com','aab3238922bcc25a6f606eb525ffdc56','diego.ramirez',3),(16,'Lucía','Navarro','14151617','lucia.navarro@example.com','9bf31c7ff062936a96d3c8bd1f8f2ff3','lucia.navarro',3),(17,'Samuel','Molina','16171819','samuel.molina@example.com','c74d97b01eae257e44aa9d5bade97baf','samuel.molina',3),(18,'Elena','Castro','18192021','elena.castro@example.com','70efdf2ec9b086079795c442636b55fb','elena.castro',3),(19,'David','Silva','20212223','david.silva@example.com','6f4922f45568161a8cdf4ad2299f6d23','david.silva',3),(20,'Sara','Delgado','22232425','sara.delgado@example.com','1f0e3dad99908345f7439f8ffabdffc4','sara.delgado',3),(21,'Javier','Rojas','24252627','javier.rojas@example.com','98f13708210194c475687be6106a3b84','javier.rojas',3),(22,'Paula','Vargas','26272829','paula.vargas@example.com','3c59dc048e8850243be8079a5c74d079','paula.vargas',3),(23,'Tomás','Peña','28293031','tomas.pena@example.com','b6d767d2f8ed5d21a44b0e5886680cb9','tomas.pena',3),(24,'Natalia','Serrano','30313233','natalia.serrano@example.com','37693cfc748049e45d87b8c7d8b9aacd','natalia.serrano',3),(25,'Álvaro','Iglesias','32333435','alvaro.iglesias@example.com','1ff1de774005f8da13f42943881c655f','alvaro.iglesias',3),(26,'Valeria','González','1234567890','valeria@mail.com','123','valgon',3),(27,'Carlos','Ríos','2345678901','carlos@mail.com','123','carrio',3),(28,'Marta','Silva','3456789012','marta@mail.com','123','marsil',3),(29,'David','Cortés','4567890123','david@mail.com','123','davcor',3),(30,'Laura','Lopez','5678901234','laura@mail.com','123','laulop',3),(31,'Santiago','Vargas','6789012345','santiago@mail.com','123','sanvar',3),(32,'Camila','Duarte','7890123456','camila@mail.com','123','camdua',3),(33,'Andrés','Moreno','8901234567','andres@mail.com','123','andmor',3),(34,'Isabella','Jiménez','9012345678','isa@mail.com','123','isajim',3),(35,'Juan','Mendoza','0123456789','juan@mail.com','123','juamen',3),(36,'Natalia','Reyes','1123456789','natalia@mail.com','123','natrey',3),(37,'Pedro','Quintero','1223456789','pedro@mail.com','123','pedqui',3),(38,'Elena','Cano','1323456789','elena@mail.com','123','elecan',3),(39,'Luis','Martínez','1423456789','luis@mail.com','123','luimar',3),(40,'Sara','Castro','1523456789','sara@mail.com','123','sarcas',3),(41,'Diego','Ortiz','1623456789','diego@mail.com','123','dieort',3),(42,'Lucía','Herrera','1723456789','lucia@mail.com','123','lucher',3),(43,'Tomás','Ramírez','1823456789','tomas@mail.com','123','tomram',3),(44,'Manuela','Peña','1923456789','manuela@mail.com','123','manpen',3),(45,'Sebastián','Cruz','2023456789','sebastian@mail.com','123','sebcru',3),(46,'Mariana','Ruiz','2123456789','mariana@mail.com','123','marrui',3),(47,'Julián','Nieto','2223456789','julian@mail.com','123','julnie',3),(48,'Adriana','Salazar','2323456789','adriana@mail.com','123','adrsal',3),(49,'Felipe','Castaño','2423456789','felipe@mail.com','123','felcas',3),(50,'Daniela','Mejía','2523456789','daniela@mail.com','123','danmej',3),(71,'Fernando','Yara','000000001','fxrcho4@gmail.com','$2b$10$1W/qUwOejukpeO5OIvDPKevTlK98pQu9kk08Mtb7frTFjbnyhuXSi','fernando',1),(77,'Omar','David','1031803887','omarnino0546@gmail.com','$2b$10$/.Ce3bK9eax3istPc9lFmOK/SNeb5l8BudP9qjwc1USOMsZu2/TLa','omar',2),(78,'Omar','David','1031803887','omarnino0540@gmail.com','$2b$10$.GRWYoIv.HHk3Neg57glYugstmbYrlFWzwRQFOHEizlps95.wqKem','salome',2),(79,'jhon','cepeda','66778899','omarnino0547@gmail.com','$2b$10$E0u8jzSoOP03nxCSeMgFAeXkIUemB4H0JfHlPpz4aQNzGu3cZQFm.','omar',2),(80,'Omar','David','1031803887','valentina.diaz1@example.com','$2b$10$WnVnzzLO0VxiSFhQ8Fgd6.RY9sVpagKaauZrEoEhu5akLJHI1cPy2','omar',2),(81,'Omar','David','1031803887','omarnino0554@gmail.com','$2b$10$OyGGNmjgq84ekrMu5j8SmuPhtiNPGjuKvQoT/74EGNz.RV1ClKe0y','1',2),(82,'Omar','David','1031803887','omarnino054@gmail.com','$2b$10$65bx54co32WuYm04UOzXF.U6wphk.2.A8eytRQ8EYAm2xZxISoWz6','omar',2),(83,'Omar','David','1031803887','omarnino05@gmail.com','$2b$10$C6Z8QZv4wxk2Ocwo1Eohs.pJa0sAfQfxuBFnUfD42D3wnIIUQD86u','12',2),(84,'','','','','$2b$10$ioQpCk5KaBSlHB.CrgAx5.JHXZs.WuK3BeZasidRKfwVlj7qBp4Ve','',2),(85,'Sofi','Yara','1109','sofi@gmail.com','$2b$10$zVIbfzhV1Aj1K.nMrfdt/ujiaI01wSYwmrzTrLH4bV1Y6DELm3Nca','sofi',2),(86,'fernando','Yara','1109283','jferyara@gmail.com','$2b$10$RgJhDakf1iJxdDX7vDdyWOSg4lIWJ84RHQ.ndJr/POTNTmeUnYn7C','Fercho',2),(87,'Jairo','Yara','','jairoYara@gmail.com','$2b$10$2wWc533VNfpLFqjLmtk8T.WTRzE8l5DEhP.sppGGqXMZltxwQrxG.','jairoYara',2),(88,'nose','nose','123121','nose@','$2b$10$D9H96CEPl88yOfSGo0F4cedqql6yetL1d6L.AE/b/I4WO3Um8wdRq','nose',2),(89,'Omar','Nino','11092983','omarnose@gmail.com','$2b$10$38E9SOZpe3sLbA6.dzEJ6uchFKW1yJ87EF9vuUy0S5UvQ740yvsqe','omarnose',2),(90,'aaron josue','mora rodelo','1109839832','aaron.mora@gmail.com','$2b$10$uB52Awg/RxRc6WswYtXM8OjD0ihIzOSVi7WOJUaZ5TX/GyFJ8SSi2','aaron.mora',2),(91,'ddasdsa','asdas','12321','312312@gmail.com','$2b$10$iglso8Uyzs9VaGZ4OPwSAutuNrHZd5h6DzfWlMqyDSgX6JVzIFGO6','312312',2),(92,'vcxv','vxcvxcv','vxcvxc','vxcvxc@vxcz','$2b$10$4pYZxb6STtg2yF.Icsb9ceCpm9/VHdsaZokhCwX4lJ.TN9NVUAgZ6','vxcvxc',2),(93,'John FEr','Yara','123454','fer@gmail.com','$2b$10$BhJAiiPHmCFglLn1cgb/QOF/LqZJFGTO7REvjptSG9ixZIgnNo5/6','fer',2),(94,'Maryo','Ariztizabal','1121222','maryo@gmail.com','$2b$10$v2i6pGzNnrFMrtgIVvUbl.DZ4F2UUrHvFexGIRivO6kIWMc2k2Eka','maryo',2),(95,'fer','Yara Tique','1212212','fer12345@gmail.com','$2b$10$cJqqSF2Uftq4KfE5KlA.keaIftpqGqxCMs6U6wH3dfrIfpIIqj7fi','DF3ER',2);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `id_usuario` (`id_usuario`),
  KEY `id_pedido` (`id_pedido`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,1,NULL,NULL,'pendiente','2025-07-08'),(2,2,NULL,NULL,'completada','2025-07-08'),(3,3,NULL,NULL,'completada','2025-07-08'),(4,4,NULL,NULL,'completada','2025-07-08'),(5,5,NULL,NULL,'completada','2025-07-08'),(6,6,NULL,NULL,'completada','2025-07-08'),(7,7,NULL,NULL,'completada','2025-07-08'),(8,8,NULL,NULL,'completada','2025-07-08'),(9,9,NULL,NULL,'completada','2025-07-08'),(10,10,NULL,NULL,'completada','2025-07-08'),(11,11,NULL,NULL,'completada','2025-07-08'),(12,12,NULL,NULL,'completada','2025-07-08'),(13,13,NULL,NULL,'completada','2025-07-08'),(14,14,NULL,NULL,'completada','2025-07-08'),(15,15,NULL,NULL,'completada','2025-07-08'),(16,16,NULL,NULL,'completada','2025-07-08'),(17,17,NULL,NULL,'completada','2025-07-08'),(18,18,NULL,NULL,'completada','2025-07-08'),(20,20,NULL,NULL,'completada','2025-07-08'),(21,21,NULL,NULL,'completada','2025-07-08'),(22,22,NULL,NULL,'completada','2025-07-08'),(23,23,NULL,NULL,'completada','2025-07-08'),(24,24,NULL,NULL,'completada','2025-07-08'),(25,25,NULL,NULL,'completada','2025-07-08'),(53,94,94,285000.00,'completada','2026-03-07'),(54,94,95,92000.00,'completada','2026-03-07'),(55,94,96,92000.00,'completada','2026-03-07'),(56,71,98,8173000.00,'completada','2026-03-07');
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-24 12:51:39
