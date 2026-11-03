import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CatalogGuard, SupplierGuard, PartsController, SuppliersController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { StockService } from './stock.service';
import { StockController, PurchaseController, OrderMaterialsGuard, OrderCostGuard } from './stock.controller';
@Module({imports:[AuthModule],controllers:[PartsController,SuppliersController,StockController,PurchaseController],providers:[StockService,CatalogService,CatalogGuard,SupplierGuard,OrderMaterialsGuard,OrderCostGuard]})
export class InventoryModule {}
